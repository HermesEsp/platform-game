// application/useCases/ApplySpikeHit.ts
import type { Player } from "../../domain/entities/player/Player";

export class ApplySpikeHit {
  static execute(
    player: Player,
    body: Phaser.Physics.Arcade.Body
  ) {
    // 🔴 Se já morreu ou está morrendo, ignora
    if (!player.life.isAlive()) return;

    player.takeDamage(10, "spikes");

    // 🟢 Knockback só se sobreviveu
    if (player.life.isAlive()) {
      body.setVelocityY(-250);
    }
  }
}
