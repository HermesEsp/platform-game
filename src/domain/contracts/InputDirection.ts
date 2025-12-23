export const DIRECTIONS = ['left', 'right'] as const;
export const ACTIONS = ['space'] as const;

export type Direction = typeof DIRECTIONS[number];
export type Action = typeof ACTIONS[number];

export type InputState = Record<Direction & Action, boolean>;

export function isDirection(value: string): value is Direction {
  return DIRECTIONS.includes(value as Direction);
}

export function isAction(value: string): value is Action {
  return ACTIONS.includes(value as Action);
}
