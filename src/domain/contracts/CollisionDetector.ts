import type { Vector2 } from "../valueObjects/Vector2";

export interface ICollisionDetector {
  isColliding(position: Vector2): boolean;
}
