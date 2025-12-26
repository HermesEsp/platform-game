import { BaseProjectile } from "./BaseProjectile";
import type { DamageType } from "../combat/DamageType";

export class StraightProjectile extends BaseProjectile {
  static right(amount: number, speed: number, type: DamageType) {
    return new StraightProjectile(amount, { x: speed, y: 0 }, type);
  }

  static left(amount: number, speed: number, type: DamageType) {
    return new StraightProjectile(amount, { x: -speed, y: 0 }, type);
  }

  static up(amount: number, speed: number, type: DamageType) {
    return new StraightProjectile(amount, { x: 0, y: -speed }, type);
  }

  static down(amount: number, speed: number, type: DamageType) {
    return new StraightProjectile(amount, { x: 0, y: speed }, type);
  }
}