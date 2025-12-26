import type { Player } from "../../domain/entities/player/Player";

export class JumpThroughPlatformFactory {
  static createForPlayer(
    scene: Phaser.Scene,
    playerGO: Phaser.Physics.Arcade.Sprite,
    playerEntity: Player,
    layer: Phaser.Tilemaps.TilemapLayer
  ) {
    layer.setCollisionByExclusion([-1]);

    scene.physics.add.collider(
      playerGO,
      layer,
      undefined,
      (playerGO, tile) => {
        const { body } = playerGO as Phaser.Physics.Arcade.Sprite;
        if (!body) return false;

        const tileBody = tile as Phaser.Tilemaps.Tile;
        if (!tileBody) return false;

        // 1️⃣ Drop-through ativo → ignora tudo
        if (playerEntity.dropThrough.isActive()) {
          return false;
        }

        // 2️⃣ Só colide se estiver caindo
        if (body.velocity.y <= 0) {
          return false;
        }

        const playerBottom = body.bottom;
        const tileTop = tileBody.pixelY;

        // 3️⃣ Garante que veio de cima
        const comingFromAbove = playerBottom <= tileTop + body.velocity.y * scene.game.loop.delta / 1000 + 2;

        return comingFromAbove;
      },
      scene
    );
  }
}
