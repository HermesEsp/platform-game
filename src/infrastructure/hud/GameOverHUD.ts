import Phaser from "phaser";

export class GameOverHUD {
  private container: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    onRestart: () => void
  ) {
    const { width, height } = scene.scale;

    const bg = scene.add.rectangle(
      0,
      0,
      width,
      height,
      0x000000,
      0.6
    ).setOrigin(0);

    const title = scene.add.text(
      width / 2,
      height / 2 - 20,
      "GAME OVER",
      {
        fontSize: "32px",
        color: "#ff5555"
      }
    ).setOrigin(0.5);

    const hint = scene.add.text(
      width / 2,
      height / 2 + 20,
      "Pressione R para reiniciar",
      {
        fontSize: "14px",
        color: "#ffffff"
      }
    ).setOrigin(0.5);

    this.container = scene.add.container(0, 0, [
      bg,
      title,
      hint
    ]);

    this.container.setDepth(2000);
    this.container.setScrollFactor(0);

    if (scene.input.keyboard) {
      scene.input.keyboard.once("keydown-R", () => {
        onRestart();
      });
    }
  }

  destroy() {
    this.container.destroy(true);
  }
}
