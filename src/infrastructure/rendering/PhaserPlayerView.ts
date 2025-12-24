// infrastructure/rendering/PhaserPlayerView.ts
import Phaser from "phaser";
import { Player } from "../../domain/entities/Player";

export class PhaserPlayerView {
  private sprite: Phaser.Physics.Arcade.Sprite;

  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;
  }

  syncFromEntity(player: Player) {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    if (!body) throw new Error("Sprite must have a body");

    // ============================
    // Movimento Horizontal
    // ============================

    const currentSpeed = player.getSpeed() * player.getSpeedMultiplier();

    switch (player.getHorizontalIntent()) {
      case "left":
        body.setVelocityX(-currentSpeed);
        this.sprite.setFlipX(true);
        break;
      case "right":
        body.setVelocityX(currentSpeed);
        this.sprite.setFlipX(false);
        break;
      case "idle":
        body.setVelocityX(0);
        break;
    }

    // ============================
    // Saltos
    // ============================
    if (player.hasJumpIntent() && body.blocked.down) {

      body.setVelocityY(-player.getJumpForce());
      player.consumeJump();
    }

    // ============================
    // Drop-through
    // ============================
    if (player.hasDropThroughIntent() && body.blocked.down) {
      player.requestDropThrough();

      // Mantém o estado de "dropping" por 150ms para atravessar o tile
      this.sprite.scene.time.delayedCall(150, () => {
        player.consumeDropThrough();
      });
    }
  }

  updateAnimation(player: Player) {
    if (!(this.sprite.body as Phaser.Physics.Arcade.Body).blocked.down) {
      this.sprite.play("jump", true);
      return;
    }

    const dir = player.getHorizontalIntent();
    if (dir === "left" || dir === "right") {
      this.sprite.play("run", true);
      return;
    }

    player.isDeeplyIdle() ?
      this.sprite.play("inactive", true) :
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
