import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience(); // singleton
    this.setInstance();
  }

  setInstance() {
    const { canvas } = this.experience;

    this.instance = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });

    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor("#211d20");

    this.resize();
  }

  resize() {
    const { sizes } = this.experience;

    this.instance.setSize(sizes.width, sizes.height);
    this.instance.setPixelRatio(sizes.pixelRatio);
  }

  update() {
    const { scene, camera } = this.experience;

    this.instance.render(scene, camera.instance);
  }
}
