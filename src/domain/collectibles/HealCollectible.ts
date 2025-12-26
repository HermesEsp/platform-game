import type { Collectible } from "../contracts/Collectible";
import type { Player } from "../entities/player/Player";

export class HealCollectible implements Collectible {
  private amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  collect(player: Player) {
    player.heal(this.amount);
  }
}