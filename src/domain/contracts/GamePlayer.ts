import type { Player } from "../entities/player";
import type { CameraTarget } from "./CameraTarget";

export interface GamePlayer extends CameraTarget {
  readonly entity: Player;
  update(delta: number): void;
  destroy(): void;
}