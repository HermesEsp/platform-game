import type { Player } from "../../domain/entities/player/Player";
import type { PlayerActionIntent } from "./PlayIntent";

export class DropThroughPlayer {
  static execute(player: Player, intent: PlayerActionIntent) {
    if (intent.dropThrough) {
      player.dropThrough.request();
    }
  }
}

