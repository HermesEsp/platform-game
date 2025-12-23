import type { InputState } from "../../domain/contracts/InputState";

type KeyMap = Record<string, (pressed: boolean) => void>;

export class KeyboardInput {
  private state: InputState = {
    left: false,
    right: false,
    space: false,
  };

  private readonly keyMap: KeyMap = {
    KeyA: (pressed) => this.state.left = pressed,
    KeyD: (pressed) => this.state.right = pressed,
    Space: (pressed) => this.state.space = pressed,
  };

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard!;

    keyboard.on("keydown", (event: KeyboardEvent) => {
      if (event.repeat) return;
      this.updateKey(event.code, true);
    });

    keyboard.on("keyup", (event: KeyboardEvent) => {
      this.updateKey(event.code, false);
    });
  }

  private updateKey(code: string, pressed: boolean) {
    if (!this.keyMap[code]) return;

    this.keyMap[code](pressed);
  }

  getState(): InputState {
    return { ...this.state };
  }

}
