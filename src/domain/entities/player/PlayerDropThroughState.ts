export class PlayerDropThrough {
  private intent = false;
  private active = false;

  request() {
    this.intent = true;
  }

  tryExecute(isGrounded: boolean): boolean {
    if (!this.intent || !isGrounded) return false;
    this.intent = false;
    this.active = true;
    return true;
  }

  stop() {
    this.active = false;
  }

  isActive() {
    return this.active;
  }
}
