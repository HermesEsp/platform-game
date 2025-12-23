import Phaser from "phaser";
import { PhaserPlayerView } from "../../infrastructure/rendering/PhaserPlayerView";
import { KeyboardInput } from "../../infrastructure/input/KeyboardInput";
import { MovePlayer } from "../../application/useCases/MovePlayer";

// Tipo genérico para GameObject com Arcade Body
type ArcadeGameObject = Phaser.GameObjects.GameObject & {
  body: Phaser.Physics.Arcade.Body;
};

export class MainScene extends Phaser.Scene {
  private playerView!: PhaserPlayerView;
  private keyboard!: KeyboardInput;

  private readonly playerSpeed = 200;
  private readonly cameraZoom = 1;

  constructor() {
    super("MainScene");
  }

  create() {
    /* ===============================
     * 1️⃣ MAPA
     * =============================== */
    const map = this.make.tilemap({ key: "map_v1" });

    const tileset = map.addTilesetImage(
      "grass",     // nome do tileset no Tiled
      "Grass"    // key carregada no preload
    );

    if (!tileset) {
      throw new Error("Tileset não encontrado");
    }

    const groundLayer = map.createLayer("Ground", tileset);
    const wallsLayer = map.createLayer("Walls", tileset);

    if (!groundLayer || !wallsLayer) {
      throw new Error("Camadas Ground/Walls não encontradas");
    }

    // Colisão baseada em propriedade do tile
    wallsLayer.setCollisionByProperty({ collides: true });

    /* ===============================
     * 2️⃣ PLAYER
     * =============================== */
    this.playerView = this.createPlayer(400, 300);

    // Player × paredes
    this.physics.add.collider(
      this.playerView.getCameraTarget(),
      wallsLayer
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

  private createPlayer(x: number, y: number): PhaserPlayerView {
    const playerGO = this.add
      .rectangle(x, y, 16, 16, 0x4ade80)
      .setDepth(10) as ArcadeGameObject;

    this.physics.add.existing(playerGO);
    playerGO.body.setCollideWorldBounds(true);

    return new PhaserPlayerView(playerGO);
  }

  update() {
    MovePlayer.execute(
      this.playerView,
      this.keyboard.getState(),
      this.playerSpeed
    );
  }
}
