import { Vector2 } from "../../domain/valueObjects/Vector2";
import type Phaser from "phaser";
import type { IMovable } from "../../domain/contracts/IMovable";

type ArcadeGameObject = Phaser.GameObjects.GameObject & { body: Phaser.Physics.Arcade.Body };

export class PhaserPlayerView implements IMovable {
  private readonly body: Phaser.Physics.Arcade.Body;

  constructor(gameObject: ArcadeGameObject) {
    // Garantir que o corpo existe
    const body = gameObject.body as Phaser.Physics.Arcade.Body | null;
    if (!body) {
      throw new Error("PhaserPlayerView precisa de um corpo Arcade Physics");
    }
    this.body = body;
  }

  /**
   * Define a velocidade do player em pixels/segundo
   * @param velocity Vector2 normalizado ou escalado
   */
  setVelocity(velocity: Vector2) {
    this.body.setVelocity(velocity.x, velocity.y);
  }

  /**
   * Opcional: parar o player
   */
  stop() {
    this.body.setVelocity(0, 0);
  }

  /**
   * Opcional: obter posição
   */
  getPosition(): Vector2 {
    return Vector2.create(this.body.x, this.body.y);
  }

  getCameraTarget(): Phaser.Physics.Arcade.Body {
    return this.body;
  }
}
