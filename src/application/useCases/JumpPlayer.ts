import type { Player } from "../../domain/entities/Player";
import type { PlayerActionIntent } from "./PlayIntent";

export class JumpPlayer {
  static execute(
    player: Player,
    intent: PlayerActionIntent,
  ) {
    if (intent.jump) {
      player.requestJump();
    }
  }
}
