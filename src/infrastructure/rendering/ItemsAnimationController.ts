import type Phaser from "phaser";
import type { ItemAnimation } from "../../domain/contracts/ItemAnimation";

export class ItemAnimationController {
  private readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly animations: ItemAnimation;
  private current?: string;

  constructor(
    sprite: Phaser.Physics.Arcade.Sprite,
    animations: ItemAnimation
  ) {
    this.sprite = sprite;
    this.animations = animations;
  }

  playIdle() {
    this.play(this.animations.idle);
  }

  playCollected() {
    this.play(this.animations.collected);
  }

  playActive() {
    this.play(this.animations.active);
  }

  playDestroy() {
    this.play(this.animations.destroy);
  }

  private play(key?: string) {
    if (!key) return;

    if (this.current !== key) {
      this.current = key;
      this.sprite.play(key);
    }
  }
}
