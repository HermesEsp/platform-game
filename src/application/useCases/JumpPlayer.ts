import type { InputActionState } from "../../domain/contracts/InputState";
import type { Player } from "../../domain/entities/Player";

export class JumpPlayer {
  static execute(
    player: Player,
    input: InputActionState,
    jumpForce: number
  ) {
    if (!player.isOnGround) return;

    if (input.space) {
      player.isJumping = true;
      player.jumpForce = jumpForce;
      player.isOnGround = false;
    }
  }
}

