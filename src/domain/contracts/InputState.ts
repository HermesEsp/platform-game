export type InputMovementState = {
  left: boolean;
  right: boolean;
};

export type InputActionState = {
  space: boolean;
};

export type InputState = InputMovementState & InputActionState;


