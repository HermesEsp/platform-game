import type { Damageable } from "./Damageable";
import type { DamageType } from "../combat/DamageType";


export interface DamageSource {
  readonly type: DamageType;
  readonly amount: number;

  apply(target: Damageable): void;
}