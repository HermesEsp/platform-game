import type { Collectible } from "../contracts/Collectible";
import type { Player } from "../entities/player/Player";

export class CoinCollectible implements Collectible {
  private amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  collect(player: Player) {
    console.log('collect')
    player.coin(this.amount);
  }
}