import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
  constructor() {
    this.experience = new Experience(); // singleton

    // Debug
    this.debugFolder = this.experience.debug.ui?.addFolder("Environment");

    // Setup
    this.setSunLight();
    this.setEnvMap();
  }

  setSunLight() {
    const { scene } = this.experience;

    this.sunLight = new THREE.DirectionalLight("#ffffff", 2);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);

    scene.add(this.sunLight);

    // Debug
    if (this.debugFolder) {
      this.debugFolder
        .add(this.sunLight, "intensity")
        .name("sunLightIntensity")
        .min(0)
        .max(10)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "x")
        .name("sunLight X")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "y")
        .name("sunLight Y")
        .min(-5)
        .max(5)
        .step(0.001);

      this.debugFolder
        .add(this.sunLight.position, "z")
        .name("sunLight Z")
        .min(-5)
        .max(5)
        .step(0.001);
    }
  }

  setEnvMap() {
    const { scene, resources } = this.experience;

    this.envMap = {};

    this.envMap.intensity = 0.4;
    this.envMap.texture = resources.items["envMapTexture"];
    this.envMap.texture.colorSpace = THREE.SRGBColorSpace;

    scene.environment = this.envMap.texture;
    // scene.background = this.envMap.texture;

    // needed to make sure env map works on all materials regardless when the material is created
    this.envMap.updateMaterials = () => {
      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.envMap.texture;
          child.material.envMapIntensity = this.envMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };

    this.envMap.updateMaterials();

    // Debug
    if (this.debugFolder) {
      this.debugFolder
        .add(this.envMap, "intensity")
        .name("envMap Intensity")
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(() => this.envMap.updateMaterials());
    }
  }
}
