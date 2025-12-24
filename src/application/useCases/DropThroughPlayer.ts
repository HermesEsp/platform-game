import type { Player } from "../../domain/entities/Player";
import type { PlayerActionIntent } from "./PlayIntent";

export class DropThroughPlayer {
  static execute(player: Player, intent: PlayerActionIntent) {
    if (intent.dropThrough && !player.hasDropThroughIntent()) {
      player.requestDropThrough();
    }
  }
}

