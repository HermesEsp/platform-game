import Phaser from "phaser";
import type { Player } from "../../domain/entities/player/Player";

export class HealthBarHUD {
  private barBg: Phaser.GameObjects.Rectangle;
  private barFill: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;

  private readonly width = 200;
  private readonly height = 28;


  constructor(
    private scene: Phaser.Scene,
    private player: Player,
    x = 16,
    y = 16
  ) {
    // fundo
    this.barBg = this.scene.add.rectangle(x, y, this.width, this.height, 0x222222)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1000);

    // barra
    this.barFill = this.scene.add.rectangle(x, y, this.width, this.height, 0xe74c3c)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1001);

    // texto
    this.text = this.scene.add.text(
      x + this.width / 2,
      y + this.height / 2,
      "",
      {
        fontSize: "22px",
        color: "#ffffff"
      }
    )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(1002);

    this.update();
  }

  update() {
    const current = this.player.life.getHealth();
    const max = this.player.life.getMaxHealth()

    const percent = Phaser.Math.Clamp(current / max, 0, 1);
    this.barFill.width = this.width * percent;

    this.text.setText(`${current} / ${max}`);
  }

  destroy() {
    this.barBg.destroy();
    this.barFill.destroy();
    this.text.destroy();
  }
}
