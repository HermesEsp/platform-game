import { CreatePlayer } from "../../application/factories/CreatePlayer";
import { CoinCollectible } from "../../domain/collectibles/CoinCollectible";
import { HealCollectible } from "../../domain/collectibles/HealCollectible";
import type { GamePlayer } from "../../domain/contracts/GamePlayer";
import { Spike } from "../../domain/entities/Spike";
import { CoinAnimation } from "../../domain/items/CoinAnimatio";
import { HealAnimation } from "../../domain/items/HealAnimation";
import { CollectibleFactory } from "../../infrastructure/factories/CollectibleFactory";
import { HazardFactory } from "../../infrastructure/factories/HazardFactory";
import { ItemsAnimationFactory } from "../../infrastructure/factories/ItemsAnimationFactory";
import { JumpThroughPlatformFactory } from "../../infrastructure/factories/JumpThroughPlatformFactory";
import { PlayerAnimationFactory } from "../../infrastructure/factories/PlayerAnimationFactory";
import { WorldItemFactory } from "../../infrastructure/factories/WorldItemFActory";
import { CoinCounterHUD } from "../../infrastructure/hud/CoinCounterHUD";
import { GameHUD } from "../../infrastructure/hud/GameHUD";
import { GameOverHUD } from "../../infrastructure/hud/GameOverHUD";
import { HealthBarHUD } from "../../infrastructure/hud/HealthBarHUD";
import { KeyboardInput } from "../../infrastructure/input/KeyboardInput";
import { assertTilemapLayer } from "../utils/assert";

export class MainScene extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;

  private player!: GamePlayer;
  private keyboard!: KeyboardInput;
  private HUD!: GameHUD;
  private healthBarHUD!: HealthBarHUD;
  private coinCounterHUD!: CoinCounterHUD;
  private gameOverHUD?: GameOverHUD;
  private isGameOver = false;

  private healGroup!: Phaser.Physics.Arcade.Group;
  private coinGroup!: Phaser.Physics.Arcade.Group;

  private groundLayer!: Phaser.Tilemaps.TilemapLayer;
  private platformLayer!: Phaser.Tilemaps.TilemapLayer;
  private spikesLayer!: Phaser.Tilemaps.TilemapLayer;
  private jumpLayer!: Phaser.Tilemaps.TilemapLayer;
  private plantsLayer!: Phaser.Tilemaps.TilemapLayer;

  private readonly cameraZoom = 1;

  constructor() {
    super("MainScene");
  }

  /* ===============================
   * 🚀 BOOTSTRAP
   * =============================== */
  create() {
    this.bootstrapInitialize();
    this.bootstrapWorld();
    this.bootstrapPlayer();
    this.bootstrapItems();
    this.bootstrapEnemies();

    // 🔥 SEMPRE POR ÚLTIMO
    this.bindPhysics();
    this.bindCamera();
    this.bindHUD();
  }

  update(_time: number, delta: number) {
    if (this.isGameOver) return;

    this.player.update(delta);

    const target = this.player.getCameraTarget();
    if (target && target.y > this.physics.world.bounds.height + 100) {
      this.player.entity.takeDamage(999, "void");
    }

    this.HUD.update();
  }

  private bootstrapInitialize() {
    this.physics.world.resume();
    this.isGameOver = false;
  }

  /* ===============================
   * 🌍 WORLD
   * =============================== */
  private bootstrapWorld() {
    this.map = this.make.tilemap({ key: "level1" });

    const tileset = this.map.addTilesetImage("Tiles", "tiles");
    if (!tileset) throw new Error("Tileset não encontrado");

    this.groundLayer = assertTilemapLayer(this.map.createLayer("ground", tileset), "ground");
    this.platformLayer = assertTilemapLayer(this.map.createLayer("platform", tileset), "platform");
    this.spikesLayer = assertTilemapLayer(this.map.createLayer("spikes", tileset), "spikes");
    this.plantsLayer = assertTilemapLayer(this.map.createLayer("plants", tileset), "plants");
    this.jumpLayer = assertTilemapLayer(this.map.createLayer("jump_through", tileset), "jump_through");

    [this.groundLayer, this.platformLayer, this.plantsLayer]
      .forEach(layer => layer.setCollisionByProperty({ collides: true }));

    this.jumpLayer.setCollisionByExclusion([-1]);

    const { widthInPixels, heightInPixels } = this.map;
    this.physics.world.setBounds(0, 0, widthInPixels, heightInPixels);
    this.physics.world.setBoundsCollision(true, true, true, false);
  }

  /* ===============================setBoundsCollision
   * 🧍 PLAYER
   * =============================== */
  private bootstrapPlayer() {
    const spawn = this.getSpawnPoint();
    this.player = CreatePlayer.local(this, spawn);
    PlayerAnimationFactory.register(this);
    this.keyboard = new KeyboardInput(this);

    this.player.entity.life.onDeath = () => {
      this.onPlayerDeath();
    };
  }

  /* ===============================
   * 🎁 ITENS
   * =============================== */
  private bootstrapItems() {
    ItemsAnimationFactory.register(this);

    this.healGroup = this.physics.add.group({ allowGravity: false });
    this.coinGroup = this.physics.add.group({ allowGravity: false });

    WorldItemFactory.createFromTiled(this, this.map, {
      layer: "heals",
      type: "heal",
      texture: "items",
      frame: 8,
      animation: HealAnimation,
      group: this.healGroup,
      onCreate: sprite => {
        sprite.setData("collected", false);
      }
    });

    WorldItemFactory.createFromTiled(this, this.map, {
      layer: "coins",
      type: "coin",
      texture: "items",
      frame: 8,
      animation: CoinAnimation,
      group: this.coinGroup,
      onCreate: sprite => {
        sprite.setData("collected", false);
      }
    });
  }

  /* ===============================
   * 👾 INIMIGOS / HAZARDS
   * =============================== */
  private bootstrapEnemies() {
    // reservado para inimigos futuros
  }

  /* ===============================
   * 🔗 PHYSICS BINDINGS
   * =============================== */
  private bindPhysics() {
    const sprite = this.player.getPhysicsSprite();

    this.physics.add.collider(sprite, this.groundLayer);
    this.physics.add.collider(sprite, this.platformLayer);

    HazardFactory.enableForPlayer(
      this,
      sprite,
      this.player.entity,
      this.spikesLayer,
      new Spike()
    );

    JumpThroughPlatformFactory.enableForPlayer(
      this,
      sprite,
      this.player.entity,
      this.jumpLayer
    );

    CollectibleFactory.enableForPlayer(
      this,
      sprite,
      this.player.entity,
      this.healGroup,
      new HealCollectible(10)
    );

    CollectibleFactory.enableForPlayer(
      this,
      sprite,
      this.player.entity,
      this.coinGroup,
      new CoinCollectible(1)
    );
  }

  /* ===============================
   * 📷 CAMERA
   * =============================== */
  private bindCamera() {
    const camera = this.cameras.main;
    const target = this.player.getCameraTarget();

    if (target) {
      camera.startFollow(target, true, 0.1, 0.1);
    }

    camera.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );

    camera.setZoom(this.cameraZoom);
  }

  /* ===============================
   * ❤️ HUD
   * =============================== */
  private bindHUD() {
    this.HUD = new GameHUD(this, this.player.entity)
  }

  /* ===============================
   * 🧰 HELPERS
   * =============================== */
  private getSpawnPoint(): { x: number; y: number } {
    const spawnPoint = this.map.findObject(
      "spawn",
      obj => obj.name === "spawn_point"
    );

    if (!spawnPoint) throw new Error("Spawn point not found");

    return {
      x: spawnPoint.x ?? 50,
      y: spawnPoint.y ?? 50
    };
  }

  private onPlayerDeath() {
    if (this.isGameOver) return;
    this.isGameOver = true;

    // pausa física e lógica
    this.physics.world.pause();
    this.player.getPhysicsSprite().setVelocity(0, 0);

    this.gameOverHUD = new GameOverHUD(this, () => {
      this.scene.restart();
    });


  }

}
