import Experience from "../Experience";
import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";

export default class World {
  constructor() {
    this.experience = new Experience(); // singleton

    this.experience.resources.subscribe("ready", () => {
      // Setup
      this.floor = new Floor();
      this.fox = new Fox();

      // needs to go last because of fn for traversing scene
      this.environment = new Environment();
    });
  }

  update() {
    this.fox?.update();
  }
}
