import type Phaser from "phaser";

const COLS = 4;

export class PlayerAnimationFactory {
  static register(scene: Phaser.Scene) {
    const anims = scene.anims;

    if (anims.exists("idle")) return; // evita recriar

    this.animRow(scene, "idle", 0, 4);
    this.animRow(scene, "run", 1, 4);
    this.animRow(scene, "jump", 2, 4, 10, 0);
    this.animRow(scene, "roll", 3, 4);
    this.animRow(scene, "hurt", 4, 3, 6, 0);
    this.animRow(scene, "death", 5, 4, 6, 0);
    this.animRow(scene, "inactive", 6, 4, 2, -1);
  }

  private static animRow(
    scene: Phaser.Scene,
    key: string,
    row: number,
    frames: number,
    frameRate = 8,
    repeat = -1
  ) {
    scene.anims.create({
      key,
      frames: scene.anims.generateFrameNumbers("player", {
        start: row * COLS,
        end: row * COLS + (frames - 1),
      }),
      frameRate,
      repeat,
    });
  }
}
