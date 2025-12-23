export interface IJumpable {
  jump(force: number): void;
  isOnGround(): boolean;
}
