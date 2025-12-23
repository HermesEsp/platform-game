import { isDirection, type Direction } from "../contracts/InputDirection";
import type { InputState } from "../contracts/InputState";
import { Vector2 } from "../valueObjects/Vector2";

const DIRECTION_VECTOR: Record<Direction, Vector2> = {
  up: Vector2.up(),
  down: Vector2.down(),
  left: Vector2.left(),
  right: Vector2.right(),
};

export class MovementRule {
  static resolve(input: InputState): Vector2 {
    let movement = Vector2.zero();

    for (const key in input) {
      if (!isDirection(key)) continue;
      if (input[key]) {
        movement = movement.add(DIRECTION_VECTOR[key]);
      }
    }

    return movement.isZero() ? Vector2.zero() : movement.normalize();
  }
}