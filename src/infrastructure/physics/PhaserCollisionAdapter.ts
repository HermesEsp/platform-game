import type Phaser from "phaser";
import type { ICollisionDetector } from "../../domain/contracts/CollisionDetector";
import { Vector2 } from "../../domain/valueObjects/Vector2";

export class PhaserCollisionAdapter implements ICollisionDetector {
  private readonly layers: Phaser.Tilemaps.TilemapLayer[];

  constructor(layers: Phaser.Tilemaps.TilemapLayer[]) {
    this.layers = layers;
  }

  isColliding(position: Vector2): boolean {
    // Verifica se há um tile com propriedade de colisão na posição informada
    return this.layers.some(layer => {
      const tile = layer.getTileAtWorldXY(position.x, position.y);
      return tile && tile.collides;
    });
  }
}
