import Phaser from "phaser";
import type { Player } from "../../../domain/entities/player";

export class PlayerAnimationController {
  private readonly sprite: Phaser.Physics.Arcade.Sprite;
  private readonly player: Player;

  constructor(sprite: Phaser.Physics.Arcade.Sprite, player: Player) {
    this.sprite = sprite;
    this.player = player;
  }

  update() {
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;

    // ============================
    // MORTE (prioridade máxima)
    // ============================
    if (this.player.life.isDead()) {
      return;
    }

    if (this.player.life.isDying()) {
      if (this.sprite.anims.currentAnim?.key !== "death") {
        this.play("death", true);

        this.sprite.once(
          Phaser.Animations.Events.ANIMATION_COMPLETE,
          () => {
            this.player.life.markDead();
            this.sprite.setVisible(false);
          }
        );
      }
      return;
    }

    // ============================
    // HIT
    // ============================
    if (this.player.combat.isHit()) {
      if (this.sprite.anims.currentAnim?.key !== "hurt") {
        this.play("hurt", true);
      }
      return;
    }

    // ============================
    // NO AR
    // ============================

    if (!body.blocked.down) {
      this.play("jump", true);
      return;
    }

    // ============================
    // MOVIMENTO
    // ============================
    const dir = this.player.movement.getDirection();
    if (dir === "left" || dir === "right") {
      this.play("run", true);
      return;
    }

    // ============================
    // IDLE
    // ============================
    this.player.movement.isDeeplyIdle()
      ? this.play("inactive", true)
      : this.play("idle", true);
  }

  private play(key: string, ignoreIfPlaying: boolean) {
    if (this.sprite.anims.currentAnim?.key !== key) {
      this.sprite.play(key, ignoreIfPlaying);
    }
  }
}
