import Phaser from "phaser";
import { PhaserPlayerView } from "../../infrastructure/rendering/PhaserPlayerView";
import { KeyboardInput } from "../../infrastructure/input/KeyboardInput";
import { MovePlayer } from "../../application/useCases/MovePlayer";
import { PlayerAnimationFactory } from "../../infrastructure/rendering/PlayerAnimationFactory";
import { JumpPlayer } from "../../application/useCases/JumpPlayer";
import { Player } from "../../domain/entities/Player";
import { JumpThroughPlatformFactory } from "../../infrastructure/physics/JumpThroughPlatformFactory";
import { DropThroughPlayer } from "../../application/useCases/DropThroughPlayer";
import { PlayerIntent } from "../../application/useCases/PlayIntent";


export class MainScene extends Phaser.Scene {
  private playerView!: PhaserPlayerView;
  private keyboard!: KeyboardInput;
  private player!: Player;

  private readonly cameraZoom = 1;

  constructor() {
    super("MainScene");
  }

  create() {
    /* ===============================
     * 1️⃣ MAPA
     * =============================== */
    const map = this.make.tilemap({ key: "level1" });
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

    const enemiesLayer = map.createLayer("enemies", tileset);
    if (!enemiesLayer) {
      throw new Error("Camadas Enemies não encontradas");
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
    enemiesLayer.setCollisionByProperty({ collides: true });
    plantsLayer.setCollisionByProperty({ collides: true });
    jumpLayer.setCollisionByExclusion([-1]);

    /* ===============================
     * 2️⃣ PLAYER
     * =============================== */
    this.player = new Player();
    const playerGO = this.physics.add.sprite(128, 224, "player");
    playerGO.setBounce(0.2);
    playerGO.setCollideWorldBounds(true);
    playerGO.body.setSize(16, 32);

    this.playerView = new PhaserPlayerView(playerGO);

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

    JumpThroughPlatformFactory.createForPlayer(
      this,
      this.playerView.getCameraTarget(),
      this.player,
      jumpLayer,
    );

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
  }

  update(_time: number, delta: number) {
    const input = this.keyboard.getState();
    const actions = PlayerIntent.mapInput(input);

    this.player.updateIdleTime(delta);

    MovePlayer.execute(this.player, actions);
    JumpPlayer.execute(this.player, actions);
    DropThroughPlayer.execute(this.player, actions);

    this.playerView.syncFromEntity(this.player);
    this.playerView.updateAnimation(this.player);
  }
}
