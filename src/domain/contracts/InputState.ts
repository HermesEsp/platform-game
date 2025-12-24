export type InputMovementState = {
  left: boolean;
  right: boolean;
  down: boolean;
};

export type InputActionState = {
  spaceJustDown: boolean;
  shift: boolean;
};

export type InputState = InputMovementState & InputActionState;


