// src/game/Game.ts
import Phaser from "phaser";
import { gameConfig } from "./config";
import { BootScene } from "./scenes/BootScene";
import { MainScene } from "./scenes/MainScene";

export class Game extends Phaser.Game {
  constructor() {
    super({
      ...gameConfig,
      scene: [BootScene, MainScene],
    });
  }
}
