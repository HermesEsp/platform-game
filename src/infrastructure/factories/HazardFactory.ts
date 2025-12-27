import type { DamageSource } from "../../domain/contracts/DamageSource";
import type { Player } from "../../domain/entities/player/Player";

export class HazardFactory {
  static enableForPlayer(
    scene: Phaser.Scene,
    playerGO: Phaser.Physics.Arcade.Sprite,
    playerEntity: Player,
    layer: Phaser.Tilemaps.TilemapLayer,
    damageSource: DamageSource
  ) {
    scene.physics.add.overlap(
      playerGO,
      layer,
      (playerGO, tile) => {
        const p = playerGO as Phaser.Physics.Arcade.Sprite;
        const t = tile as Phaser.Tilemaps.Tile;
        this.action(p, t, playerEntity, damageSource)
      },
      undefined,
      scene
    );
  }

  private static action(
    playerGO: Phaser.Physics.Arcade.Sprite,
    tile: Phaser.Tilemaps.Tile,
    playerEntity: Player,
    damageSource: DamageSource
  ) {
    const body = playerGO.body as Phaser.Physics.Arcade.Body;
    if (!body) return;
    if (playerEntity.combat.isInvulnerable()) return;

    const props = tile.properties ?? {};
    if (!props.damage) return;

    const from = props.damageFrom ?? "full";

    const tileTop = tile.pixelY;
    const tileBottom = tile.pixelY + tile.height;
    const tileLeft = tile.pixelX;
    const tileRight = tile.pixelX + tile.width;

    const playerBottom = body.bottom;
    const playerTop = body.top;
    const playerLeft = body.left;
    const playerRight = body.right;

    let touching = false;

    switch (from) {
      case "top": {
        const damageHeight = props.damageHeight ?? tile.height;
        const damageZoneTop = tileBottom - damageHeight;

        touching =
          body.velocity.y > 0 &&
          playerBottom >= damageZoneTop &&
          playerBottom <= tileBottom;
        break;
      }

      case "bottom": {
        touching =
          body.velocity.y < 0 &&
          playerTop <= tileBottom &&
          playerTop >= tileTop;
        break;
      }

      case "left": {
        const damageWidth = props.damageWidth ?? tile.width;
        const zoneRight = tileLeft + damageWidth;

        touching =
          body.velocity.x > 0 &&
          playerRight >= tileLeft &&
          playerRight <= zoneRight;
        break;
      }

      case "right": {
        const damageWidth = props.damageWidth ?? tile.width;
        const zoneLeft = tileRight - damageWidth;

        touching =
          body.velocity.x < 0 &&
          playerLeft <= tileRight &&
          playerLeft >= zoneLeft;
        break;
      }

      case "full":
      default:
        touching = true;
    }

    if (!touching) return;

    damageSource.apply(playerEntity);
  }

}
