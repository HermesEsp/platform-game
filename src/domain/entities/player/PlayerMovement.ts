import type { PlayerDirection } from "./Player";

export class PlayerMovement {
  private direction: PlayerDirection = "idle";
  private idleTime = 0;
  private readonly idleThreshold = 15000;

  moveLeft() {
    this.direction = "left";
    this.resetIdle();
  }

  moveRight() {
    this.direction = "right";
    this.resetIdle();
  }

  stop() {
    this.direction = "idle";
  }



  update(delta: number, jumping: boolean) {
    if (this.direction === "idle" && !jumping) {
      this.idleTime += delta;
    } else {
      this.resetIdle();
    }
  }

  isDeeplyIdle() {
    return this.idleTime >= this.idleThreshold;
  }

  isIdle() {
    return this.direction === "idle";
  }

  getDirection() {
    return this.direction;
  }

  private resetIdle() {
    this.idleTime = 0;
  }
}
