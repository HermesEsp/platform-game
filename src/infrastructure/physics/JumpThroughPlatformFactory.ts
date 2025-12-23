import type Phaser from "phaser";

export class JumpThroughPlatformFactory {
  static create(
    scene: Phaser.Scene,
    layer: Phaser.Tilemaps.TilemapLayer
  ) {
    // Ativa corpos físicos para os tiles
    layer.setCollisionByExclusion([-1]);

    scene.physics.add.collider(
      scene.physics.world.bodies.entries[0].gameObject, // placeholder
      layer,
      undefined,
      (playerGO, tile) => {
        const { body } = playerGO as Phaser.Physics.Arcade.Sprite;
        const tileBody = tile as Phaser.Tilemaps.Tile;

        if (!body) {
          throw new Error("JumpThroughPlatformFactory -Player must have a body");
        }

        // Só colide se estiver caindo
        if (body.velocity.y <= 0) return false;


        const playerBottom = body.y + body.height;
        const tileTop = tileBody.pixelY;

        // Tolerância evita "grudar" ao subir
        return playerBottom <= tileTop + 6;
      },
      scene
    );
  }

  /**
   * Variante correta passando explicitamente o player
   */
  static createForPlayer(
    scene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite,
    layer: Phaser.Tilemaps.TilemapLayer
  ) {
    layer.setCollisionByExclusion([-1]);

    scene.physics.add.collider(
      player,
      layer,
      undefined,
      (playerGO, tile) => {
        const body = (playerGO as Phaser.Physics.Arcade.Sprite).body;
        const tileBody = tile as Phaser.Tilemaps.Tile;

        if (!body) return false;

        // Só quando estiver caindo
        if (body.velocity.y <= 0) return false;

        const playerBottom = body.bottom;
        const tileTop = tileBody.pixelY;

        // Player precisa estar vindo de cima
        const comingFromAbove =
          playerBottom <= tileTop + body.velocity.y * scene.game.loop.delta / 1000 + 2;

        return comingFromAbove;
      },
      scene
    );

  }
}
