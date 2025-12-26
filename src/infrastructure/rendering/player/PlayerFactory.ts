import type Phaser from "phaser";
import { PlayerView } from "./PlayerView";
import { PlayerAnimationController } from "./PlayerAnimationController";
import { KeyboardInput } from "../../input/KeyboardInput";
import { MovePlayer } from "../../../application/useCases/MovePlayer";
import { JumpPlayer } from "../../../application/useCases/JumpPlayer";
import { PlayerIntent } from "../../../application/useCases/PlayIntent";
import type { Player } from "../../../domain/entities/player/Player";
import type { GamePlayer } from "../../../domain/contracts/GamePlayer";
import { PlayerBody } from "./PlayerBody";
import { DropThroughPlayer } from "../../../application/useCases/DropThroughPlayer";

export class PlayerFactory {
  static createLocalPlayer(
    scene: Phaser.Scene,
    entity: Player,
    spawn: { x: number; y: number }
  ): GamePlayer {
    const sprite = PlayerBody.create(scene, spawn);

    const view = new PlayerView(sprite);
    view.setGravity();
    const animation = new PlayerAnimationController(sprite, entity);
    const input = new KeyboardInput(scene);


    return {
      entity,

      getPhysicsSprite: () => sprite,
      getCameraTarget: () => sprite, // câmera segue local

      update(delta) {
        const rawInput = input.getState();
        const intent = PlayerIntent.mapInput(rawInput);

        entity.update(delta);

        MovePlayer.execute(entity, intent);
        JumpPlayer.execute(entity, intent);
        DropThroughPlayer.execute(entity, intent)

        view.syncFromEntity(entity);
        animation.update();
      },

      destroy() {
        sprite.destroy();
      }
    };
  }

  static createRemotePlayer(
    scene: Phaser.Scene,
    entity: Player,
    spawn: { x: number; y: number }
  ): GamePlayer {
    const sprite = PlayerBody.create(scene, spawn);

    const view = new PlayerView(sprite);
    view.setGravity();
    const animation = new PlayerAnimationController(sprite, entity);

    return {
      entity,

      getPhysicsSprite: () => sprite,
      getCameraTarget: () => null, // câmera segue local

      update(delta) {
        entity.update(delta);
        view.syncFromEntity(entity);
        animation.update();
      },

      destroy() {
        sprite.destroy();
      }
    };
  }
}
