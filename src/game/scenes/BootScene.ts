import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    this.load.tilemapTiledJSON("map_v1", "assets/tilesets/tiledProject/map_v1.json");
    this.load.image("grass", "assets/tilesets/TX_Tileset_Grass.png");
    this.load.image("struct", "assets/tilesets/TX Struct.png");
    this.load.image("wall", "assets/tilesets/TX Tileset Wall.png");
    this.load.image("props", "assets/tilesets/TX Props.png");
    this.load.image("ground", "assets/tilesets/TX_Tileset_Stone_Ground.png");
    this.load.image("shadow", "assets/tilesets/TX Shadow.png");
    this.load.image("plant", "assets/tilesets/TX Plant.png");
    this.load.image("shadow_plant", "assets/tilesets/TX Shadow Plant.png");
  }

  create() {
    this.scene.start("MainScene");
  }
}
