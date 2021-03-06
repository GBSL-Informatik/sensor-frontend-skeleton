/**
 * emit all 32ms a new event
 */
const INTERVAL = 32;

export default class MotionSimulator {
  x = 0.0;
  y = 0.0;
  z = -9.81;

  dx = 0.0;
  dy = 0.0;
  dz = 0.0;

  alpha = 0.0;
  beta = 0.0;
  gamma = 0.0;

  counter = 0;

  constructor() {
    this.deviceSimulator = document.getElementById("DeviceSimulator");
    if (this.deviceSimulator) {
      this.intervalId = setInterval(this.emitMotionEvent, INTERVAL);
    }
  }

  stopSimulation() {
    clearInterval(this.intervalId);
  }

  get acceleration() {
    return {
      x: this.dx,
      y: this.dy,
      z: this.dz
    };
  }

  get accelerationIncludingGravity() {
    return {
      x: this.x,
      y: this.y,
      z: this.z
    };
  }

  get rotationRate() {
    return {
      alpha: this.alpha,
      beta: this.beta,
      gamma: this.gamma
    };
  }

  nextValues() {
    this.alpha = Math.sin(this.counter / (2000 / INTERVAL));
    this.beta = Math.cos(this.counter / (2000 / INTERVAL));

    this.dx = Math.random() / 10;
    this.dy = Math.random() / 10;
    this.dz = Math.sin(this.counter / (50 / INTERVAL));

    this.x = this.dx + 0;
    this.y = this.dy + 9.81;
    this.z = this.dz + 0;

    this.counter += 1;
  }


  emitMotionEvent = () => {
    this.nextValues();
    const event = new DeviceMotionEvent(
      "devicemotion",
      {
        acceleration: this.acceleration,
        accelerationIncludingGravity: this.accelerationIncludingGravity,
        rotationRate: this.rotationRate,
        interval: INTERVAL
      }
    )

    this.deviceSimulator.dispatchEvent(event);
  }
}