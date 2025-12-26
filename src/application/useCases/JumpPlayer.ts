import type { Player } from "../../domain/entities/player/Player";
import type { PlayerActionIntent } from "./PlayIntent";

export class JumpPlayer {
  static execute(
    player: Player,
    intent: PlayerActionIntent,
  ) {
    if (intent.jump) {
      player.jump.execute();
    }
  }
}
