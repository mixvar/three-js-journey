import * as THREE from "three";
import Experience from "../Experience";

export default class Fox {
  constructor() {
    this.experience = new Experience();

    // Debug
    this.debugFolder = this.experience.debug.ui?.addFolder("Fox");

    // Setup
    this.setResource();
    this.setModel();
    this.setAnimation();
  }

  setResource() {
    const { resources } = this.experience;

    this.resource = resources.items["foxModel"];
  }

  setModel() {
    const { scene } = this.experience;

    this.model = this.resource.scene;
    this.model.scale.multiplyScalar(0.02);

    scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    this.animation.actions = {};
    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0]
    );
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1]
    );
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2]
    );

    this.animation.current = this.animation.actions.idle;
    this.animation.current.play();

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const prevAction = this.animation.current;

      if (newAction === prevAction) {
        return;
      }

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(prevAction, 1);

      this.animation.current = newAction;
    };

    // Debug
    if (this.debugFolder) {
      const debugObject = {
        playIdle: () => this.animation.play("idle"),
        playWalking: () => this.animation.play("walking"),
        playRunning: () => this.animation.play("running"),
      };

      this.debugFolder.add(debugObject, "playIdle");
      this.debugFolder.add(debugObject, "playWalking");
      this.debugFolder.add(debugObject, "playRunning");
    }
  }

  update() {
    const { time } = this.experience;

    // convert ms to s
    this.animation.mixer.update(time.delta / 1000);
  }
}
