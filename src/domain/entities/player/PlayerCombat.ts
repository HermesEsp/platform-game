import type { DamageType } from "../../combat/DamageType";
import type { PlayerLife } from "./PlayerLife";

export class PlayerCombat {
  private invulnerability = 0;
  private hitTimer = 0;
  private readonly hitDuration = 200;

  constructor(private readonly life: PlayerLife) { }

  isInvulnerable() {
    return this.invulnerability > 0;
  }

  takeDamage(amount: number, _type: DamageType) {
    if (this.invulnerability > 0) return;
    this.life.takeDamage(amount);
    if (this.life.isAlive()) {
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
}
