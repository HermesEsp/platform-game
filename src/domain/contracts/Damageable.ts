import type { DamageType } from "../combat/DamageType";

export interface Damageable {
  takeDamage(amount: number, type: DamageType): void;
}