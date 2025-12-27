import type { Collectible } from "../contracts/Collectible";
import type { Player } from "../entities/player/Player";
import { COIN_ID } from "../items/ids";

export class CoinCollectible implements Collectible {
  constructor(private amount = 1) { }

  collect(player: Player) {
    player.inventory.add(
      {
        id: COIN_ID,
        type: COIN_ID,
        name: "Coin",
        stackable: true,
      },
      this.amount
    );
  }
}