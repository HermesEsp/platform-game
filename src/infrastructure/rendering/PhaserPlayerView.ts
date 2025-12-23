// infrastructure/rendering/PhaserPlayerView.ts
import Phaser from "phaser";
import { Player } from "../../domain/entities/Player";

export class PhaserPlayerView {
  private sprite: Phaser.Physics.Arcade.Sprite
  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite
  }

  syncFromEntity(player: Player) {
    // Movimento horizontal
    if (player.direction === "left") {
      this.sprite.setVelocityX(-player.speed);
      this.sprite.setFlipX(true);
    } else if (player.direction === "right") {
      this.sprite.setVelocityX(player.speed);
      this.sprite.setFlipX(false);
    } else {
      this.sprite.setVelocityX(0);
    }

    // Pulo
    if (player.isJumping) {
      this.sprite.setVelocityY(-player.jumpForce);
      player.isJumping = false;
    }

    // Estado físico → entity
    if (!this.sprite.body) {
      throw new Error("Sprite must have a body");
    }
    player.isOnGround = this.sprite.body.blocked.down;
  }

  updateAnimation(player: Player) {
    if (!player.isOnGround) {
      this.sprite.play("jump", true);
      return;
    }

    if (player.direction === "left" || player.direction === "right") {
      this.sprite.play("run", true);
      return;
    }

    this.sprite.play("idle", true);
  }

  getCameraTarget() {
    return this.sprite;
  }

  setGravity(gravity = 1200) {
    this.sprite.setGravityY(gravity);
    this.sprite.setMaxVelocity(300, 1000);
  }
}
