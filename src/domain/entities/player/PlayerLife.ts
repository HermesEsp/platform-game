import type { LifeState } from "../player/Player";

export class PlayerLife {
  private state: LifeState = "alive";

  isAlive() { return this.state === "alive"; }
  isDying() { return this.state === "dying"; }
  isDead() { return this.state === "dead"; }

  kill() {
    this.state = "dying";
  }

  markDead() {
    if (this.state === "dying") {
      this.state = "dead";
    }
  }

  getState() {
    return this.state;
  }
}
