import type { Player } from "../entities/player/Player";

export interface Collectible {
  collect(player: Player): void;
}