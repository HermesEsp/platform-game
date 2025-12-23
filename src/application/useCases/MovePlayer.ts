import type { InputState } from "../../domain/contracts/InputState";
import { MovementRule } from "../../domain/rules/MovementRule";
import type { Vector2 } from "../../domain/valueObjects/Vector2";
import type { IMovable } from "../../domain/contracts/IMovable";

export class MovePlayer {
  static execute(player: IMovable, input: InputState, speed: number) {
    const direction: Vector2 = MovementRule.resolve(input);
    const velocity: Vector2 = direction.scale(speed);
    player.setVelocity(velocity);
  }
}