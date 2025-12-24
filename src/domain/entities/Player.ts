// domain/entities/Player.ts
export type PlayerDirection = "left" | "right" | "idle";

export class Player {
  // Intenções de movimento
  private horizontalIntent: PlayerDirection = "idle";
  private jumpIntent = false;
  private dropThroughIntent = false;
  private runIntent = false;
  private idleTime = 0; // Tempo acumulado parado em ms

  private speed = 150;
  private readonly idle_threshold = 15000; // 5 segundos para considerar inativo
  private runMultiplier = 2;
  private walkMultiplier = 1;

  private jumpForce = 450;

  /* ======================
   * MOVIMENTO
   * ====================== */
  moveLeft() {
    this.horizontalIntent = "left";
    this.resetIdleTime();
  }
  moveRight() {
    this.horizontalIntent = "right";
    this.resetIdleTime();
  }
  stopMoving() {
    this.horizontalIntent = "idle";
  }

  updateIdleTime(delta: number) {
    if (this.horizontalIntent === "idle" && !this.jumpIntent) {
      this.idleTime += delta;
    } else {
      this.resetIdleTime();
    }
  }

  resetIdleTime() {
    this.idleTime = 0;
  }

  isDeeplyIdle() {
    return this.idleTime >= this.idle_threshold;
  }

  getHorizontalIntent() { return this.horizontalIntent; }

  /* ======================
   * PULO
   * ====================== */
  requestJump() { this.jumpIntent = true; }
  consumeJump() { this.jumpIntent = false; }
  hasJumpIntent() { return this.jumpIntent; }
  getJumpForce() { return this.jumpForce; }

  /* ======================
   * DROP THROUGH
   * ====================== */
  requestDropThrough() { this.dropThroughIntent = true; }
  consumeDropThrough() { this.dropThroughIntent = false; }
  hasDropThroughIntent() { return this.dropThroughIntent; }

  /* ======================
   * RUN
   * ====================== */
  requestRun() { this.runIntent = true; }
  consumeRun() { this.runIntent = false; }
  hasRunIntent() { return this.runIntent; }

  /* ======================
   * SPEED
   * ====================== */
  setSpeed(speed: number) { this.speed = speed; }
  getSpeed() { return this.speed; }
  getSpeedMultiplier() {
    return this.hasRunIntent() ? this.runMultiplier : this.walkMultiplier;
  }
}
