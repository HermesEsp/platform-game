export type PlayerDirection = "left" | "right" | "idle";

export class Player {
  direction: PlayerDirection = "idle";

  isOnGround = false;
  isJumping = false;

  speed = 0;
  jumpForce = 0;
}