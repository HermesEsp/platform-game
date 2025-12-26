import type { Player } from "../entities/player/Player";
import type { DamageType } from "../combat/DamageType";
import type { Projectile } from "../contracts/Projectile";

export abstract class BaseProjectile implements Projectile {
  protected velocity: { x: number; y: number };
  amount: number;
  type: DamageType;

  constructor(
    amount: number,
    velocity: { x: number; y: number },
    type: DamageType
  ) {
    this.amount = amount;
    this.velocity = velocity;
    this.type = type;
  }

  apply(player: Player) {
    player.takeDamage(this.amount, this.type);
  }

  getVelocity() {
    return this.velocity;
  }
}