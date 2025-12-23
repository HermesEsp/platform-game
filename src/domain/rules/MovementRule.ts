import type { Direction } from "../contracts/InputDirection";
import type { InputMovementState } from "../contracts/InputState";
import { Vector2 } from "../valueObjects/Vector2";

const DIRECTION_VECTOR: Omit<Record<Direction, Vector2>, 'up' | 'down'> = {
  left: Vector2.left(),
  right: Vector2.right(),
};

export class MovementRule {
  static resolve(input: InputMovementState): Vector2 {
    let movement = Vector2.zero();

    if (input.left) movement = movement.add(DIRECTION_VECTOR.left);
    if (input.right) movement = movement.add(DIRECTION_VECTOR.right);

    return movement.isZero() ? Vector2.zero() : movement.normalize();
  }
}