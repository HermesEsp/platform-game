import type { ItemAnimation } from "../../domain/contracts/ItemAnimation";
import { ItemAnimationController } from "../rendering/ItemsAnimationController";

export class WorldItemFactory {
  static createFromTiled(
    scene: Phaser.Scene,
    map: Phaser.Tilemaps.Tilemap,
    config: {
      layer: string;
      type: string;
      texture: string;
      frame: number;
      animation?: ItemAnimation;
      group: Phaser.Physics.Arcade.Group;
      onCreate?: (sprite: Phaser.Physics.Arcade.Sprite) => void;
    }
  ) {
    const objectLayer = map.getObjectLayer(config.layer);
    if (!objectLayer) return;

    objectLayer.objects.forEach(obj => {
      if (obj.type !== config.type) return;

      const sprite = scene.physics.add.sprite(
        obj.x!,
        obj.y!,
        config.texture,
        config.frame
      );

      config.group.add(sprite);

      sprite.setOrigin(0.5);
      sprite.setDepth(10);
      sprite.setImmovable(true);

      const body = sprite.body as Phaser.Physics.Arcade.Body;
      body.setSize(obj.width ?? 32, obj.height ?? 32);
      body.allowGravity = false;

      sprite.refreshBody();

      if (config.animation) {
        const controller = new ItemAnimationController(sprite, config.animation);
        sprite.setData("animationController", controller);
        controller.playIdle();
      }

      config.onCreate?.(sprite);
    });
  }
}
