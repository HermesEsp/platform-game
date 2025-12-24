import type { InputState } from "../../domain/contracts/InputState";

export interface PlayerActionIntent {
  moveLeft: boolean;
  moveRight: boolean;
  jump: boolean;
  dropThrough: boolean;
  run: boolean;
}

export class PlayerIntent {
  static mapInput(input: InputState): PlayerActionIntent {
    return {
      moveLeft: input.left,
      moveRight: input.right,
      jump: input.spaceJustDown && !input.down,
      dropThrough: input.down && input.spaceJustDown,
      run: input.shift,
    };
  }
}
