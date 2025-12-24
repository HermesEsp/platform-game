import type { Player } from "../../domain/entities/Player";
import type { PlayerActionIntent } from "./PlayIntent";

export class MovePlayer {
  static execute(player: Player, intent: PlayerActionIntent) {
    // Gerenciar Corrida
    if (intent.run) {
      player.requestRun();
    } else {
      player.consumeRun(); // Para de correr se soltar o botão
    }

    const axisX = Number(intent.moveRight) - Number(intent.moveLeft);

    if (axisX === 1) return player.moveRight();
    if (axisX === -1) return player.moveLeft();
    player.stopMoving();
  }
}