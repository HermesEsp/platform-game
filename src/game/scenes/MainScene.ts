import Phaser from "phaser";
import { KeyboardInput } from "../../infrastructure/input/KeyboardInput";
import { PlayerAnimationFactory } from "../../infrastructure/factories/PlayerAnimationFactory";
import { PhaserHealthBar } from "../../infrastructure/hud/HealthBar";
import { ItemsAnimationFactory } from "../../infrastructure/factories/ItemsAnimationFactory";
import { HazardFactory } from "../../infrastructure/factories/HazardFactory";
import { JumpThroughPlatformFactory } from "../../infrastructure/factories/JumpThroughPlatformFactory";
import { Spike } from "../../domain/entities/Spike";
import { ItemAnimationController } from "../../infrastructure/rendering/ItemsAnimationController";
import { HealAnimation } from "../../domain/items/HealAnimation";
import { CreatePlayer } from "../../application/factories/CreatePlayer";
import type { GamePlayer } from "../../domain/contracts/GamePlayer";
import { assertTilemapLayer } from "../utils/assert";

export class MainScene extends Phaser.Scene {
  private player!: GamePlayer;
  private keyboard!: KeyboardInput;
  private healthBar!: PhaserHealthBar;
  private healGroup!: Phaser.Physics.Arcade.Group;
  private readonly cameraZoom = 1;

  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private platformLayer!: Phaser.Tilemaps.TilemapLayer;
  private spikesLayer!: Phaser.Tilemaps.TilemapLayer;
  private jumpLayer!: Phaser.Tilemaps.TilemapLayer;
  private plantsLayer!: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super("MainScene");
  }

  create() {
    /* ===============================
     * 1️⃣ MAPA
     * =============================== */
    const map = this.make.tilemap({ key: "level1" });
    const tileset = map.addTilesetImage("Tiles", "tiles");
    if (!tileset) throw new Error("Tileset não encontrado");

    this.groundLayer = assertTilemapLayer(map.createLayer("ground", tileset), "ground");
    this.platformLayer = assertTilemapLayer(map.createLayer("platform", tileset), "platform");
    this.spikesLayer = assertTilemapLayer(map.createLayer("spikes", tileset), "spikes");
    this.plantsLayer = assertTilemapLayer(map.createLayer("plants", tileset), "plants");
    this.jumpLayer = assertTilemapLayer(map.createLayer("jump_through", tileset), "jump_through");

    [this.groundLayer, this.platformLayer, this.plantsLayer].forEach(layer => layer?.setCollisionByProperty({ collides: true }));
    this.jumpLayer?.setCollisionByExclusion([-1]);

    this.physics.world.setBoundsCollision(true, true, true, false);

    /* ===============================
     * 2️⃣ PLAYER
     * =============================== */
    const spawn = this.getSpawnPoint(map);
    this.player = CreatePlayer.local(this, spawn);

    PlayerAnimationFactory.register(this);

    this.attachPlayerToWorld(this.player);

    /* ===============================
     * 3️⃣ VIDA
     * =============================== */
    this.healthBar = new PhaserHealthBar(this, this.player.entity);

    /* ===============================
     * 4️⃣ INPUT
     * =============================== */
    this.keyboard = new KeyboardInput(this);

    /* ===============================
     * 5️⃣ CÂMERA
     * =============================== */
    const worldWidth = map.widthInPixels;
    const worldHeight = map.heightInPixels;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    const camera = this.cameras.main;
    const target = this.player.getCameraTarget();
    if (target) camera.startFollow(target, true, 0.1, 0.1);
    camera.setBounds(0, 0, worldWidth, worldHeight);
    camera.setZoom(this.cameraZoom);

    /* ===============================
     * 6️⃣ HEALS
     * =============================== */
    ItemsAnimationFactory.register(this);

    this.healGroup = this.physics.add.group({ allowGravity: false, immovable: true });
    this.createHeals(map);

    if (target) {
      this.physics.add.overlap(
        target,
        this.healGroup,
        (playerGO, healGO) => {
          const player = playerGO as Phaser.Physics.Arcade.Sprite;
          const heal = healGO as Phaser.Physics.Arcade.Sprite;
          this.onHealCollected(player, heal);
        },
        undefined,
        this
      );
    }
  }

  update(_time: number, delta: number) {

    // Executa update do player (useCases integrados)
    this.player.update(delta);


    const target = this.player.getCameraTarget();
    if (target && target.y > this.physics.world.bounds.height + 100) {
      this.player.entity.takeDamage(999, "void");
    }

    this.healthBar.update();
  }

  /* ===============================
   * Helpers
   * =============================== */
  private getSpawnPoint(map: Phaser.Tilemaps.Tilemap): { x: number; y: number } {
    const spawnPoint = map.findObject("spawn", obj => obj.name === "spawn_point");
    if (!spawnPoint) throw new Error("Spawn point not found");
    return { x: spawnPoint.x ?? 50, y: spawnPoint.y ?? 50 };
  }

  private attachPlayerToWorld(player: GamePlayer) {
    const sprite = player.getPhysicsSprite();

    this.physics.add.collider(sprite, this.platformLayer);
    this.physics.add.collider(sprite, this.groundLayer);
    HazardFactory.createForPlayer(this, sprite, player.entity, this.spikesLayer, new Spike());
    JumpThroughPlatformFactory.createForPlayer(this, sprite, player.entity, this.jumpLayer);
  }


  private onHealCollected(_playerGO: Phaser.Physics.Arcade.Sprite, healGO: Phaser.Physics.Arcade.Sprite) {
    const heal = healGO as Phaser.Physics.Arcade.Sprite;
    if (heal.getData("collected")) return;
    heal.setData("collected", true);

    const controller = heal.getData("animationController") as ItemAnimationController;

    controller.playCollected();
    this.player.entity.combat.heal(10);

    if (heal.body) heal.body.enable = false;

    heal.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => heal.destroy());
  }

  private createHeals(map: Phaser.Tilemaps.Tilemap) {
    const layer = map.getObjectLayer("heals");
    if (!layer) return;

    layer.objects.forEach(obj => {
      if (obj.type !== "heal") return;

      const w = obj.width ?? 32;
      const h = obj.height ?? 32;

      const heal = this.healGroup.create(obj.x, obj.y, "items", 8) as Phaser.Physics.Arcade.Sprite;
      heal.setOrigin(0.5);
      heal.setDepth(10);

      const body = heal.body as Phaser.Physics.Arcade.Body;
      body.setSize(w, h);
      body.allowGravity = false;
      heal.setImmovable(true);

      const controller = new ItemAnimationController(heal, HealAnimation);
      heal.setData("animationController", controller);
      controller.playIdle();
    });
  }
}
