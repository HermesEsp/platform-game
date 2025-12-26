import type { Collectible } from "../../domain/contracts/Collectible";
import type { Player } from "../../domain/entities/player/Player";

export class CollectibleFactory {
  static createForPlayer(
    scene: Phaser.Scene,
    playerGO: Phaser.Physics.Arcade.Sprite,
    playerEntity: Player,
    group: Phaser.Physics.Arcade.Group,
    collectible: Collectible
  ) {
    scene.physics.add.overlap(
      playerGO,
      group,
      (_, item) => {
        collectible.collect(playerEntity);
        item.destroy();
      },
      undefined,
      scene
    );
  }
}
