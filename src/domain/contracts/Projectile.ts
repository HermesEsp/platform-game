import type { DamageSource } from "./DamageSource";

export interface Projectile extends DamageSource {
  getVelocity(): { x: number; y: number };
}