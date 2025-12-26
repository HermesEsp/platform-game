export class PlayerSpeed {
  private speed = 150;
  private readonly walkMultiplier = 1;
  private readonly runMultiplier = 2;
  private running = false;

  startRun() {
    this.running = true;
  }

  stopRun() {
    this.running = false;
  }

  getFinalSpeed() {
    return this.speed * (this.running ? this.runMultiplier : this.walkMultiplier);
  }

  getBaseSpeed() {
    return this.speed;
  }
}
