import type { Direction } from "../../domain/contracts/InputDirection";
import type { InputState } from "../../domain/contracts/InputState";

type MovementKey = "w" | "a" | "s" | "d";

export class KeyboardInput {
  private state: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  private readonly allowedMovementActions: Record<
    MovementKey,
    (pressed: boolean) => void
  > = {
      w: (pressed) => this.handleMovement("up", pressed),
      s: (pressed) => this.handleMovement("down", pressed),
      a: (pressed) => this.handleMovement("left", pressed),
      d: (pressed) => this.handleMovement("right", pressed),
    };

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard!;

    keyboard.on("keydown", (event: KeyboardEvent) => {
      if (event.repeat) return;
      this.updateKey(event.key, true);
    });

    keyboard.on("keyup", (event: KeyboardEvent) => {
      this.updateKey(event.key, false);
    });
  }

  private updateKey(key: string, pressed: boolean) {
    const movementKey = key.toLowerCase();
    if (!this.isMovementKey(movementKey)) return;

    this.allowedMovementActions[movementKey](pressed);
  }

  private handleMovement(direction: Direction, pressed: boolean) {
    if (this.state[direction] !== pressed) {
      this.state[direction] = pressed;
    }
  }

  getState(): InputState {
    return { ...this.state };
  }

  private isMovementKey(key: string): key is MovementKey {
    return key in this.allowedMovementActions;
  }
}
