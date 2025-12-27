import Phaser from "phaser";
import type { PlayerInventory } from "../../domain/entities/player/PlayerInventory";
import { COIN_ID } from "../../domain/items/ids";

export class CoinCounterHUD {
  private icon: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.Text;

  constructor(
    private scene: Phaser.Scene,
    private inventory: PlayerInventory,
    x = 232,
    y = 16
  ) {
    this.icon = this.scene.add.image(x, y, "items", 0) // frame da moeda
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1000);

    this.text = this.scene.add.text(
      x + 32,
      y + 4,
      "0",
      {
        fontSize: "24px",
        color: "#ffd700"
      }
    )
      .setScrollFactor(0)
      .setDepth(1001);

    this.update();
  }

  update() {
    const coins = this.inventory.getQuantity(COIN_ID);
    this.text.setText(`${coins}`);
  }

  destroy() {
    this.icon.destroy();
    this.text.destroy();
  }
}
