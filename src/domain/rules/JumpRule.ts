import type { InputActionState } from "../contracts/InputState";

export class JumpRule {
  static canJump(input: InputActionState): boolean {
    return !!input.space
  }
}