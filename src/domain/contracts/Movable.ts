import type { Vector2 } from "../valueObjects/Vector2";

export interface IMovable {
  setVelocity(velocity: Vector2): void;
  getPosition(): Vector2;
}
