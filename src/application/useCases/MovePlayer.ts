import type { InputMovementState } from "../../domain/contracts/InputState";
import type { Player } from "../../domain/entities/Player";

export class MovePlayer {
  static execute(player: Player, input: InputMovementState, speed: number) {
    player.speed = speed;

    if (input.left) {
      player.direction = "left";
      return;
    }

    if (input.right) {
      player.direction = "right";
      return;
    }

    player.direction = "idle";
  }
}