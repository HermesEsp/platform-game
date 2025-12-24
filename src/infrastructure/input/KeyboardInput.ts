import type { InputState } from "../../domain/contracts/InputState";

type KeyMap = Record<string, keyof InputState>;

export class KeyboardInput {
  private state: InputState = {
    left: false,
    right: false,
    down: false,
    spaceJustDown: false,
    shift: false,
  };

  private spaceKey: Phaser.Input.Keyboard.Key;

  private readonly keyMap: KeyMap = {
    KeyA: "left",
    KeyD: "right",
    KeyS: "down",
    ShiftLeft: "shift",
    ShiftRight: "shift",
  };

  constructor(scene: Phaser.Scene) {
    const keyboard = scene.input.keyboard!;
    this.spaceKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      this.updateKey(event.code, true);
    };

    const onKeyUp = (event: KeyboardEvent) => {
      this.updateKey(event.code, false);
    };

    keyboard.on("keydown", onKeyDown);
    keyboard.on("keyup", onKeyUp);

    // Limpeza automática ao destruir/mudar a cena
    scene.events.once("shutdown", () => {
      keyboard.off("keydown", onKeyDown);
      keyboard.off("keyup", onKeyUp);
    });
  }

  private updateKey(code: string, pressed: boolean) {
    const key = this.keyMap[code];
    if (!key) return;

    this.state[key] = pressed;
  }

  getState(): InputState {
    return {
      ...this.state,
      spaceJustDown: Phaser.Input.Keyboard.JustDown(this.spaceKey)
    };
  }

}
