export class PlayerJump {
  private intent = false;
  private readonly jumpForce = 450;

  execute() {
    this.intent = true;
  }

  stop() {
    this.intent = false;
  }

  /**
    * Decide se o pulo acontece.
    * NÃO aplica força, apenas responde sim/não.
    */
  tryExecute(isGrounded: boolean): boolean {
    if (!this.intent || !isGrounded) return false;
    this.intent = false;
    return true;
  }

  getForce() {
    return this.jumpForce;
  }

  isJumpingIntent() {
    return this.intent;
  }
}
