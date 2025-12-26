import Phaser from "phaser";
import type { Player } from "../../domain/entities/player/Player";

export class PhaserHealthBar {
  private graphics: Phaser.GameObjects.Graphics;
  private player: Player;

  constructor(
    scene: Phaser.Scene,
    player: Player
  ) {
    this.graphics = scene.add.graphics();
    this.graphics.setScrollFactor(0);
    this.player = player;
  }

  update() {
    const width = 200;
    const height = 20;
    const x = 20;
    const y = 20;

    const ratio = this.player.combat.getHealth() / 100;

    this.graphics.clear();

    this.graphics.fillStyle(0x111111);
    this.graphics.fillRect(x, y, width, height);

    this.graphics.fillStyle(0x4caf50);
    this.graphics.fillRect(x, y, width * ratio, height);
  }
}
