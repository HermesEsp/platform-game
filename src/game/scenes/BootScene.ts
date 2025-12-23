import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.tilemapTiledJSON("level1", "assets/tilesetProject/levels/level1.json");
    this.load.image('tiles', 'assets/tilesetProject/tiles/tiles.png')
    this.load.spritesheet('player', 'assets/tilesetProject/characters/player.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this.scene.start("MainScene");
  }
}
