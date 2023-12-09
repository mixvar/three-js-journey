import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Experience from "./Experience";

export default class Camera {
  constructor() {
    this.experience = new Experience(); // singleton
    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    const { scene, sizes } = this.experience;

    this.instance = new THREE.PerspectiveCamera(
      35,
      sizes.width / sizes.height,
      0.1,
      100
    );
    this.instance.position.set(6, 4, 8);
    scene.add(this.instance);
  }

  setOrbitControls() {
    const { canvas } = this.experience;

    this.orbitControls = new OrbitControls(this.instance, canvas);
    this.orbitControls.enableDamping = true;
  }

  resize() {
    const { sizes } = this.experience;
    this.instance.aspect = sizes.width / sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.orbitControls.update();
  }
}
