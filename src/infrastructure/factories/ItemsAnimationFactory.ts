import type Phaser from "phaser";

const ITEM_TEXTURE = "items";

const ITEM_ANIMS = {
  heal_idle: {
    frames: [8, 9, 10, 11, 12],
    frameRate: 8,
    repeat: -1,
  },
  heal_collected: {
    frames: [12],
    frameRate: 8,
    repeat: 0,
  },
} as const;

export class ItemsAnimationFactory {
  static register(scene: Phaser.Scene) {
    Object.entries(ITEM_ANIMS).forEach(([key, config]) => {
      if (scene.anims.exists(key)) return;

      scene.anims.create({
        key,
        frames: scene.anims.generateFrameNumbers(ITEM_TEXTURE, {
          start: config.frames[0],
          end: config.frames[config.frames.length - 1]
        }),
        frameRate: config.frameRate,
        repeat: config.repeat,
      });
    });
  }
}
