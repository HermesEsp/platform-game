import type Phaser from "phaser";

export class PlayerAnimationController {
  private readonly sprite: Phaser.Physics.Arcade.Sprite;

  constructor(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;
  }

  update() {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // Flip baseado na velocidade real
    if (body.velocity.x < 0) {
      this.sprite.setFlipX(true);
    } else if (body.velocity.x > 0) {
      this.sprite.setFlipX(false);
    }

    // 👉 NO AR (pulo ou queda)
    if (!body.blocked.down) {
      this.play("jump");
      return;
    }

    // 👉 ANDANDO
    if (Math.abs(body.velocity.x) > 5) {
      this.play("run");
      return;
    }

    // 👉 PARADO
    this.play("idle");
  }

  private play(key: string) {
    if (this.sprite.anims.currentAnim?.key !== key) {
      this.sprite.play(key);
    }
  }
}
