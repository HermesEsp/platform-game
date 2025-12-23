import { Vector2 } from "../../domain/valueObjects/Vector2";
import type Phaser from "phaser";
import type { IMovable } from "../../domain/contracts/IMovable";
import { PlayerAnimationController } from "./PlayerAnimationController";

export class PhaserPlayerView implements IMovable {
  private readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly animation: PlayerAnimationController;

  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;
    if (!this.sprite.body) {
      throw new Error("Sprite must have a body");
    }
    this.animation = new PlayerAnimationController(sprite);
  }

  setVelocity(velocity: Vector2) {
    this.sprite.setVelocityX(velocity.x);
  }

  updateAnimation() {
    this.animation.update();
  }

  setGravity(gravity: number = 1200) {
    this.sprite.setGravityY(gravity);
    this.sprite.setDrag(0, 0);
    this.sprite.setMaxVelocity(300, 1000);
  }

  stop() {
    this.sprite.setVelocity(0, 0);
  }

  jump(force: number) {
    const { body } = this.sprite;
    if (!body || !body.blocked.down) return;
    this.sprite.setVelocityY(-force);
  }

  isOnGround(): boolean {
    const { body } = this.sprite;
    if (!body) return false;
    return body.blocked.down;
  }


  getPosition(): Vector2 {
    return Vector2.create(this.sprite.x, this.sprite.y);
  }

  getCameraTarget(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }
}
