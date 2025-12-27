import type { LifeState } from "../player/Player";

export class PlayerLife {
  private health = 100;
  private readonly maxHealth = 100;
  private state: LifeState = "alive";

  isAlive() { return this.state === "alive"; }
  isDying() { return this.state === "dying"; }
  isDead() { return this.state === "dead"; }
  onDeath() { }

  kill() { this.state = "dying"; }
  getState() { return this.state; }
  getHealth() { return this.health; }
  getMaxHealth() { return this.maxHealth; }

  takeDamage(amount: number) {
    if (this.state !== "alive") return;

    this.health = Math.max(0, this.health - amount);

    if (this.health === 0) {
      this.state = "dying";
    }
  }

  heal(amount: number) {
    if (this.state !== "alive") return;
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  markDead() {
    if (this.state === "dying") {
      this.state = "dead";
      this.onDeath?.();
    }
  }
}
