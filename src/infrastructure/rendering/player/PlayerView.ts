// infrastructure/rendering/PhaserPlayerView.ts
import Phaser from "phaser";
import type { Player } from "../../../domain/entities/player";

export class PlayerView {
  private sprite: Phaser.Physics.Arcade.Sprite;

  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;

  }

  syncFromEntity(player: Player) {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    if (player.life.getState() !== "alive") {
      body.setVelocity(0, 0);
      return;
    }

    const speed = player.speed.getFinalSpeed();

    switch (player.movement.getDirection()) {
      case "left":
        body.setVelocityX(-speed);
        this.sprite.setFlipX(true);
        break;
      case "right":
        body.setVelocityX(speed);
        this.sprite.setFlipX(false);
        break;
      default:
        body.setVelocityX(0);
    }

    if (player.jump.tryExecute(body.blocked.down)) {
      body.setVelocityY(-player.jump.getForce());
    }

    if (player.dropThrough.tryExecute(body.blocked.down)) {
      this.sprite.scene.time.delayedCall(150, () => {
        player.dropThrough.stop();
      });
    }
  }


  getCameraTarget() {
    return this.sprite;
  }

  setGravity(gravity = 1200) {
    this.sprite.setGravityY(gravity);
    this.sprite.setMaxVelocity(300, 1000);
  }
}
