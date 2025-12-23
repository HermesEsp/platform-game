export class Vector2 {
  public readonly x: number;
  public readonly y: number;

  private constructor(x: number, y: number) {
    Vector2.validate(x, y);
    this.x = x;
    this.y = y;
  }

  static create(x: number, y: number): Vector2 {
    return new Vector2(x, y);
  }

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static jump(): Vector2 {
    return new Vector2(0, -1);
  }

  static down(): Vector2 {
    return new Vector2(0, 1);
  }

  static left(): Vector2 {
    return new Vector2(-1, 0);
  }

  static right(): Vector2 {
    return new Vector2(1, 0);
  }

  add(other: Vector2): Vector2 {
    return new Vector2(
      this.x + other.x,
      this.y + other.y,
    );
  }

  scale(factor: number): Vector2 {
    return new Vector2(
      this.x * factor,
      this.y * factor
    );
  }

  equals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  normalize(): Vector2 {
    const length = Math.sqrt(this.x * this.x + this.y * this.y);
    return length === 0 ? Vector2.zero() : this.scale(1 / length)
  }


  private static validate(x: number, y: number): void {
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(
        `Invalid Vector2: x=${x}, y=${y}`
      )
    }
  }
}
