import Phaser from "phaser";
import { PhaserPlayerView } from "../../infrastructure/rendering/PhaserPlayerView";
import { KeyboardInput } from "../../infrastructure/input/KeyboardInput";
import { MovePlayer } from "../../application/useCases/MovePlayer";
import { PlayerAnimationFactory } from "../../infrastructure/factories/PlayerAnimationFactory";
import { JumpPlayer } from "../../application/useCases/JumpPlayer";
import { Player } from "../../domain/entities/player/Player";
import { JumpThroughPlatformFactory } from "../../infrastructure/factories/JumpThroughPlatformFactory";
import { DropThroughPlayer } from "../../application/useCases/DropThroughPlayer";
import { PlayerIntent } from "../../application/useCases/PlayIntent";
import { PhaserHealthBar } from "../../infrastructure/hud/HealthBar";
import { HazardFactory } from "../../infrastructure/factories/HazardFactory";
import { Spike } from "../../domain/entities/Spike";
import { ItemsAnimationFactory } from "../../infrastructure/factories/ItemsAnimationFactory";
import { PlayerAnimationController } from "../../infrastructure/rendering/PlayerAnimationController";
import { ItemAnimationController } from "../../infrastructure/rendering/ItemsAnimationController";
import { HealAnimation } from "../../domain/items/HealAnimation";


export class MainScene extends Phaser.Scene {
  private playerView!: PhaserPlayerView;
  private playerAnimationController!: PlayerAnimationController;
  private keyboard!: KeyboardInput;
  private player!: Player;
  private healthBar!: PhaserHealthBar;
  private healGroup!: Phaser.Physics.Arcade.Group;

  private readonly cameraZoom = 1;

  constructor() {
    super("MainScene");
  }

  create() {


    /* ===============================
     * 1️⃣ MAPA
     * =============================== */
    const map = this.make.tilemap({ key: "level1" });
    this.physics.world.setBoundsCollision(true, true, true, false);
    const tileset = map.addTilesetImage("Tiles", "tiles");
    if (!tileset) {
      throw new Error("Tileset não encontrado");
    }

    const groundLayer = map.createLayer("ground", tileset);
    if (!groundLayer) {
      throw new Error("Camadas Ground não encontradas");
    }

    const platformLayer = map.createLayer("platform", tileset);
    if (!platformLayer) {
      throw new Error("Camadas Platform não encontradas");
    }

    const spikesLayer = map.createLayer("spikes", tileset);
    if (!spikesLayer) {
      throw new Error("Camadas Spikes não encontradas");
    }

    const plantsLayer = map.createLayer("plants", tileset);
    if (!plantsLayer) {
      throw new Error("Camadas Plants não encontradas");
    }

    const jumpLayer = map.createLayer("jump_through", tileset);
    if (!jumpLayer) {
      throw new Error("Camadas jump_through não encontradas");
    }

    // Colisão baseada em propriedade do tile
    groundLayer.setCollisionByProperty({ collides: true });
    platformLayer.setCollisionByProperty({ collides: true });
    plantsLayer.setCollisionByProperty({ collides: true });
    jumpLayer.setCollisionByExclusion([-1]);


    const spawnPoint = map.findObject("spawn", (obj) => obj.name === "spawn_point");
    if (!spawnPoint) {
      throw new Error("Spawn point not found");
    }
    const { x: spawnX = 0, y: spawnY = 0 } = spawnPoint;

    /* ===============================
     * 2️⃣ PLAYER
     * =============================== */

    this.player = new Player();
    const playerGO = this.physics.add.sprite(spawnX, spawnY, "player");
    playerGO.setBounce(0.2);
    playerGO.setCollideWorldBounds(true);
    playerGO.body.setSize(16, 32);
    playerGO.setDepth(30);



    this.playerView = new PhaserPlayerView(playerGO);
    this.playerAnimationController = new PlayerAnimationController(playerGO, this.player)

    this.playerView.setGravity();
    PlayerAnimationFactory.register(this);

    this.physics.add.collider(
      this.playerView.getCameraTarget(),
      platformLayer,
    );

    this.physics.add.collider(
      this.playerView.getCameraTarget(),
      groundLayer,
    );

    const spike = new Spike();

    HazardFactory.createForPlayer(
      this,
      this.playerView.getCameraTarget(),
      this.player,
      spikesLayer,
      spike
    );

    JumpThroughPlatformFactory.createForPlayer(
      this,
      this.playerView.getCameraTarget(),
      this.player,
      jumpLayer,
    );

    /* ===============================
     * 2️⃣ VIDA
     * =============================== */
    this.healthBar = new PhaserHealthBar(this, this.player);

    /* ===============================
     * 3️⃣ INPUT
     * =============================== */
    this.keyboard = new KeyboardInput(this);

    /* ===============================
     * 4️⃣ CÂMERA E MUNDO
     * =============================== */
    const worldWidth = map.widthInPixels;
    const worldHeight = map.heightInPixels;

    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

    const camera = this.cameras.main;
    camera.setBounds(0, 0, worldWidth, worldHeight);
    camera.startFollow(this.playerView.getCameraTarget(), true, 0.1, 0.1);
    camera.setZoom(this.cameraZoom);

    /* ===============================
     * 5️⃣ HEALS
     * =============================== */
    ItemsAnimationFactory.register(this);


    this.healGroup = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.createHeals(map);

    this.physics.add.overlap(
      this.playerView.getCameraTarget(),
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

  private onHealCollected(
    _playerGO: Phaser.GameObjects.GameObject,
    healGO: Phaser.GameObjects.GameObject
  ) {
    const heal = healGO as Phaser.Physics.Arcade.Sprite;

    const controller =
      heal.getData("animationController") as ItemAnimationController;

    controller.playCollected();
    this.player.combat.heal(10);

    heal.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      heal.destroy();
    });
  }



  private createHeals(map: Phaser.Tilemaps.Tilemap) {
    const layer = map.getObjectLayer("heals");
    if (!layer) return;

    layer.objects.forEach(obj => {
      if (obj.type !== "heal") return;

      const w = obj.width ?? 32;
      const h = obj.height ?? 32;

      const heal = this.healGroup.create(
        obj.x,
        obj.y,
        "items", // ✅ texture da spritesheet
        8        // frame inicial do heal
      ) as Phaser.Physics.Arcade.Sprite;


      heal.setOrigin(0.5);
      heal.setDepth(10);

      const body = heal.body as Phaser.Physics.Arcade.Body;
      body.setSize(w, h);
      body.allowGravity = false;

      heal.setImmovable(true);

      const controller = new ItemAnimationController(
        heal,
        HealAnimation
      );

      heal.setData("animationController", controller);
      controller.playIdle();
    });
  }

  update(_time: number, delta: number) {
    const input = this.keyboard.getState();
    const actions = PlayerIntent.mapInput(input);


    if (this.playerView.getCameraTarget().y > this.physics.world.bounds.height + 100) {
      this.player.takeDamage(999, "void");
    }

    this.player.update(delta);

    MovePlayer.execute(this.player, actions);
    JumpPlayer.execute(this.player, actions);
    DropThroughPlayer.execute(this.player, actions);

    this.playerView.syncFromEntity(this.player);
    this.playerAnimationController.update();
    this.healthBar.update();
  }
}
