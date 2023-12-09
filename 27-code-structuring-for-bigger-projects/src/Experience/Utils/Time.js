import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.start = Date.now();
    this.current = Date.now();
    this.elapsed = 0;
    this.delta = 1000 / 60; // 60 FPS as default

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    const currentTime = Date.now();

    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.dispatch("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
