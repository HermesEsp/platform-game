import type { Collectible } from "../../domain/contracts/Collectible";
import type { Player } from "../../domain/entities/player/Player";

export class CollectibleFactory {
  static enableForPlayer(
    scene: Phaser.Scene,
    playerGO: Phaser.Physics.Arcade.Sprite,
    playerEntity: Player,
    group: Phaser.Physics.Arcade.Group,
    collectible: Collectible
  ) {
    scene.physics.add.overlap(
      playerGO,
      group,
      (_, itemGO) => {
        const item = itemGO as Phaser.Physics.Arcade.Sprite;

        // 🔒 evita múltiplas coletas
        if (item.getData("collected")) return;
        item.setData("collected", true);

        // 🚫 desliga física IMEDIATAMENTE
        if (item.body) item.body.enable = false;

        collectible.collect(playerEntity);

        // 🎬 se tiver animação de coleta
        const controller = item.getData("animationController");

        if (controller) {
          controller.playCollected();

          item.once(
            Phaser.Animations.Events.ANIMATION_COMPLETE,
            () => item.destroy()
          );
        } else {
          // fallback
          item.destroy();
        }
      },
      undefined,
      scene
    );
  }
}
