import type { DamageType } from "../../combat/DamageType";
import type { Damageable } from "../../contracts/Damageable";
import { PlayerCombat } from "./PlayerCombat";
import { PlayerDropThrough } from "./PlayerDropThroughState";
import { PlayerIdle } from "./PlayerIdle";
import { PlayerJump } from "./PlayerJump";
import { PlayerLife } from "./PlayerLife";
import { PlayerMovement } from "./PlayerMovement";
import { PlayerSpeed } from "./PlayerSpeed";

export type PlayerDirection = "left" | "right" | "idle";
export type LifeState = "alive" | "dying" | "dead";

export class Player implements Damageable {
  readonly movement = new PlayerMovement();
  readonly jump = new PlayerJump();
  readonly dropThrough = new PlayerDropThrough();
  readonly life = new PlayerLife();
  readonly combat = new PlayerCombat();
  readonly speed = new PlayerSpeed();
  readonly idle = new PlayerIdle();

  update(delta: number) {
    this.idle.update(delta, this.movement, this.jump);
    this.combat.update(delta);
  }

  takeDamage(amount: number, type: DamageType): void {
    this.combat.takeDamage(amount, type);
  }
}
