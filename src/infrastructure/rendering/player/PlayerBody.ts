// infrastructure/phaser/player/PhaserPlayerBody.ts
import type Phaser from "phaser";

export class PlayerBody {
  static create(
    scene: Phaser.Scene,
    spawn: { x: number; y: number }
  ): Phaser.Physics.Arcade.Sprite {
    const sprite = scene.physics.add.sprite(
      spawn.x,
      spawn.y,
      "player"
    );

    sprite.setBounce(0.2);
    sprite.setCollideWorldBounds(true);
    sprite.setDepth(30);

    const body = sprite.body as Phaser.Physics.Arcade.Body;
    body.setSize(16, 32);

    return sprite;
  }
}
