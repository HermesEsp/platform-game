import type { Player } from "../../domain/entities/player/Player";
import type { Projectile } from "../../domain/contracts/Projectile";

export class ProjectileFactory {
  static spawnForPlayer(
    scene: Phaser.Scene,
    playerGO: Phaser.Physics.Arcade.Sprite,
    playerEntity: Player,
    x: number,
    y: number,
    texture: string,
    projectile: Projectile
  ) {
    const bullet = scene.physics.add.sprite(x, y, texture);

    const { x: vx, y: vy } = projectile.getVelocity();
    bullet.setVelocity(vx, vy);
    bullet.setGravity(0);

    scene.physics.add.overlap(
      playerGO,
      bullet,
      () => {
        if (!playerEntity.combat.isInvulnerable()) {
          projectile.apply(playerEntity);
          bullet.destroy();
        }
      },
      undefined,
      scene
    );

    return bullet;
  }
}
