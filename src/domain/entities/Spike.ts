import type { Damageable } from "../contracts/Damageable";
import type { DamageType } from "../combat/DamageType";
import type { DamageSource } from "../contracts/DamageSource";

export class Spike implements DamageSource {
  readonly type: DamageType = "spikes";
  readonly amount: number = 10;

  apply(target: Damageable): void {
    target.takeDamage(this.amount, this.type);
  }
}