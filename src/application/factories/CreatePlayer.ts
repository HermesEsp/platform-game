import type Phaser from "phaser";
import { PlayerFactory } from "../../infrastructure/rendering/player/PlayerFactory";
import { Player } from "../../domain/entities/player/Player";

export class CreatePlayer {
  static local(
    scene: Phaser.Scene,
    spawn: { x: number; y: number }
  ) {
    const entity = new Player();

    return PlayerFactory.createLocalPlayer(
      scene,
      entity,
      spawn
    );
  }

  static remote(
    scene: Phaser.Scene,
    spawn: { x: number; y: number }
  ) {
    const entity = new Player();

    return PlayerFactory.createRemotePlayer(
      scene,
      entity,
      spawn
    );
  }
}
