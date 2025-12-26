import type { DamageType } from "../../combat/DamageType";

export class PlayerCombat {
  private health = 100;
  private invulnerability = 0;
  private hitTimer = 0;
  private readonly hitDuration = 200;

  isInvulnerable() {
    return this.invulnerability > 0;
  }

  takeDamage(amount: number, _type: DamageType) {
    if (this.isInvulnerable()) return;

    this.health -= amount;

    if (this.health > 0) {
      this.invulnerability = 1000;
      this.hitTimer = this.hitDuration;
    }
  }

  update(delta: number) {
    if (this.isInvulnerable()) this.invulnerability -= delta;
    if (this.hitTimer > 0) this.hitTimer -= delta;
  }

  isHit() {
    return this.hitTimer > 0;
  }

  getHealth() {
    return Math.max(0, this.health);
  }

  heal(amount: number) {
    console.log(this.health)
    console.log(amount)
    this.health = Math.min(100, this.health + amount);
    console.log(this.health)

  }
}
