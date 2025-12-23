import Phaser from "phaser";
import { PhaserPlayerView } from "../../infrastructure/rendering/PhaserPlayerView";
import { KeyboardInput } from "../../infrastructure/input/KeyboardInput";
import { MovePlayer } from "../../application/useCases/MovePlayer";
import { PlayerAnimationFactory } from "../../infrastructure/rendering/PlayerAnimationFactory";
import { JumpPlayer } from "../../application/useCases/JumpPlayer";


export class MainScene extends Phaser.Scene {
  private playerView!: PhaserPlayerView;
  private keyboard!: KeyboardInput;

  private readonly playerSpeed = 200;
  private readonly playerJumpForce = 450;
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


    // Colisão baseada em propriedade do tile
    groundLayer.setCollisionByProperty({ collides: true });
    platformLayer.setCollisionByProperty({ collides: true });
    enemiesLayer.setCollisionByProperty({ collides: true });
    plantsLayer.setCollisionByProperty({ collides: true });

    /* ===============================
     * 2️⃣ PLAYER
     * =============================== */
    const playerGO = this.physics.add.sprite(128, 224, "player");
    playerGO.setBounce(0.2);
    playerGO.setCollideWorldBounds(true);
    playerGO.body.setSize(32, 32);
    playerGO.body.setOffset(0, 0);
    this.physics.add.collider(playerGO, groundLayer);

    this.playerView = new PhaserPlayerView(playerGO);

    // Player × paredes
    this.physics.add.collider(
      this.playerView.getCameraTarget(),
      groundLayer
    );


    this.playerView.setGravity();

    PlayerAnimationFactory.register(this);

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

  update() {
    MovePlayer.execute(
      this.playerView,
      this.keyboard.getState(),
      this.playerSpeed
    );

    JumpPlayer.execute(
      this.playerView,
      this.keyboard.getState(),
      this.playerJumpForce
    );

    this.playerView.updateAnimation();
  }
}
