import type { Player } from "../../domain/entities/player";
import type { PlayerActionIntent } from "./PlayIntent";

export class MovePlayer {
  static execute(player: Player, intent: PlayerActionIntent) {
    // Gerenciar Corrida
    if (intent.run) {
      player.speed.startRun()
    } else {
      player.speed.stopRun()
    }

    const axisX = Number(intent.moveRight) - Number(intent.moveLeft);

    if (axisX === 1) return player.movement.moveRight();
    if (axisX === -1) return player.movement.moveLeft();
    player.movement.stop();
  }
}