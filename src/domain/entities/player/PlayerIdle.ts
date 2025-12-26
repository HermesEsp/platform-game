import type { PlayerMovement } from "./PlayerMovement";
import type { PlayerJump } from "./PlayerJump";

export class PlayerIdle {
  private idleTime = 0;
  private readonly deepIdleThreshold = 15000; // ms

  update(
    delta: number,
    movement: PlayerMovement,
    jump: PlayerJump
  ) {
    const isIdle =
      movement.isIdle() &&
      !jump.isJumpingIntent();

    if (isIdle) {
      this.idleTime += delta;
    } else {
      this.idleTime = 0;
    }
  }

  isDeepIdle() {
    return this.idleTime >= this.deepIdleThreshold;
  }

  reset() {
    this.idleTime = 0;
  }
}
