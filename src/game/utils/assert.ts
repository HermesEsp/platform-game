import type Phaser from "phaser";

export function assertTilemapLayer(layer: Phaser.Tilemaps.TilemapLayer | null, name: string): Phaser.Tilemaps.TilemapLayer {
  if (!layer) {
    throw new Error(`recurso "${name}" não encontrada`);
  }
  return layer;
}