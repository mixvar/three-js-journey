import * as THREE from "three";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Resources from "./Utils/Resources";
import Debug from "./Utils/Debug";
import World from "./World/World";
import Camera from "./Camera";
import Renderer from "./Renderer";
import sources from "./sources";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    } else {
      instance = this;
    }

    // Options
    this.canvas = canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // Handle events
    this.subscriptons = [
      this.sizes.subscribe("resize", () => {
        this.resize();
      }),
      this.time.subscribe("tick", () => {
        this.update();
      }),
    ];

    // Global access
    window.experience = this;
    console.log(this);
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    // console.log("tick");
    // important to have control over order - renderer goes last
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  // we didn't cover window.addEventListenr cleanup inside soem classes
  // it probably would be better to have a dispose method on every custom class and do not dive into impl details here
  destroy() {
    this.subscriptons.forEach((unsubscribe) => unsubscribe());
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        // perhaps we iterate over this.resources instead of this magic
        for (const key in child.material) {
          const value = child.material[key];
          if (value != null && typeof value.dispose === "function") {
            value.dispose();
          }
        }

        child.material.dispose();
      }
    });
    this.renderer.instance.dispose();
    this.camera.orbitControls.dispose();
    this.debug.ui?.destroy();
  }
}
