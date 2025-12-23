export const DIRECTIONS = ['up', 'down', 'left', 'right'] as const;

export type Direction = typeof DIRECTIONS[number];

export type InputState = Record<Direction, boolean>;

export function isDirection(value: string): value is Direction {
  return DIRECTIONS.includes(value as Direction);
}