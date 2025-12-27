import type Phaser from "phaser";
import type { Player } from "../../domain/entities/player/Player";
import { HealthBarHUD } from "./HealthBarHUD";
import { CoinCounterHUD } from "./CoinCounterHUD";

export class GameHUD {
  private healthBar: HealthBarHUD;
  private coins: CoinCounterHUD;

  constructor(scene: Phaser.Scene, player: Player) {
    this.healthBar = new HealthBarHUD(scene, player);
    this.coins = new CoinCounterHUD(scene, player.inventory);
  }

  update() {
    this.healthBar.update();
    this.coins.update();
  }

  destroy() {
    this.healthBar.destroy();
    this.coins.destroy();
  }
}
