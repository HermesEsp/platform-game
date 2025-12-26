import type Phaser from "phaser";

export interface CameraTarget {
  // Sprite físico usado para colisão / física
  getPhysicsSprite(): Phaser.Physics.Arcade.Sprite;
  // Retorna sprite que a câmera deve seguir (null para remoto)
  getCameraTarget(): Phaser.Physics.Arcade.Sprite | null;
}