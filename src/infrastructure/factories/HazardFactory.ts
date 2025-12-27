import type { DamageSource } from "../../domain/contracts/DamageSource";
import type { Player } from "../../domain/entities/player/Player";
import type { DamageOrigin } from "../../domain/valueObjects/DamageOrigin";

export interface HazardProps {
  damage?: boolean;
  damageOrigin?: DamageOrigin;
  damageSize?: number;
  damageOffset?: number;
}

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
        this.action(
          playerGO as Phaser.Physics.Arcade.Sprite,
          tile as Phaser.Tilemaps.Tile,
          playerEntity,
          damageSource
        );
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

    const props: HazardProps = tile.properties ?? {};
    if (!props.damage) return;

    const origin: "top" | "bottom" | "left" | "right" =
      props.damageOrigin ?? "bottom";

    const size = props.damageSize ?? tile.height;
    const offset = props.damageOffset ?? 0;

    const tileTop = tile.pixelY;
    const tileBottom = tile.pixelY + tile.height;
    const tileLeft = tile.pixelX;
    const tileRight = tile.pixelX + tile.width;

    let zoneTop = tileTop;
    let zoneBottom = tileBottom;
    let zoneLeft = tileLeft;
    let zoneRight = tileRight;

    switch (origin) {
      case "top": {
        zoneTop = tileTop + offset;
        zoneBottom = zoneTop + size;
        break;
      }

      case "bottom": {
        zoneBottom = tileBottom - offset;
        zoneTop = zoneBottom - size;
        break;
      }

      case "left": {
        zoneLeft = tileLeft + offset;
        zoneRight = zoneLeft + size;
        break;
      }

      case "right": {
        zoneRight = tileRight - offset;
        zoneLeft = zoneRight - size;
        break;
      }
    }

    const touching =
      body.right > zoneLeft &&
      body.left < zoneRight &&
      body.bottom > zoneTop &&
      body.top < zoneBottom;

    if (!touching) return;

    damageSource.apply(playerEntity);
  }
}
