import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

/**
 * Loaders
 */
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// textures
const brickTexture = {
  color: textureLoader.load(
    "textures/castle_brick_broken_06/castle_brick_broken_06_diff_1k.jpg"
  ),
  arm: textureLoader.load(
    "textures/castle_brick_broken_06/castle_brick_broken_06_arm_1k.jpg"
  ),
  normal: textureLoader.load(
    "textures/castle_brick_broken_06/castle_brick_broken_06_nor_gl_1k.png"
  ),
};

const woodTexture = {
  color: textureLoader.load(
    "textures/wood_cabinet_worn_long/wood_cabinet_worn_long_diff_1k.jpg"
  ),
  arm: textureLoader.load(
    "textures/wood_cabinet_worn_long/wood_cabinet_worn_long_arm_1k.jpg"
  ),
  normal: textureLoader.load(
    "textures/wood_cabinet_worn_long/wood_cabinet_worn_long_nor_gl_1k.png"
  ),
};

// for actual color texture we need to use proper color space - sRGP (non linear)
// for models - GLTF file alread contains the color spcae information for textures
brickTexture.color.colorSpace = THREE.SRGBColorSpace;
woodTexture.color.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
// Debug
const gui = new GUI();
const global = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (child.isMesh && child.material.isMeshStandardMaterial) {
      child.material.envMapIntensity = global.envMapIntensity;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
// Global intensity
global.envMapIntensity = 1;
gui
  .add(global, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

// HDR (RGBE) equirectangular
rgbeLoader.load("/environmentMaps/0/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});

/** Directional Light */
const directionalLight = new THREE.DirectionalLight("#FFFFFF", 6);

directionalLight.position.set(-4, 6.5, 2.5);
scene.add(directionalLight);

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(20)
  .step(0.001)
  .name("light intesity");

gui
  .add(directionalLight.position, "x")
  .min(-20)
  .max(20)
  .step(0.1)
  .name("light X");
gui
  .add(directionalLight.position, "y")
  .min(-20)
  .max(20)
  .step(0.1)
  .name("light Y");
gui
  .add(directionalLight.position, "z")
  .min(-20)
  .max(20)
  .step(0.1)
  .name("light Z");

// light shadows

directionalLight.castShadow = true;
gui.add(directionalLight, "castShadow");

directionalLight.target.position.set(0, 4, 0);
directionalLight.target.updateWorldMatrix();

directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(512, 512);

// fix "shadow acne"
directionalLight.shadow.bias = -0.008;
directionalLight.shadow.normalBias = -0.016;

gui.add(directionalLight.shadow, "bias").min(-0.05).max(0.05).step(0.001);
gui.add(directionalLight.shadow, "normalBias").min(-0.05).max(0.05).step(0.001);

const directionalLightHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
// scene.add(directionalLightHelper);

/**
 * Models
 */

// Helmet
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10);
  scene.add(gltf.scene);

  updateAllMaterials();
});

// hamburger
// gltfLoader.load("models/hamburger.glb", (gltf) => {
//   gltf.scene.scale.multiplyScalar(0.3);
//   gltf.scene.position.y = 2.5;
//   scene.add(gltf.scene);

//   updateAllMaterials();
// });

/**
 * Meshes
 */

// Wooden Base
const baseMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    map: woodTexture.color,
    normalMap: woodTexture.normal,
    aoMap: woodTexture.arm,
    roughnessMap: woodTexture.arm,
    metalnessMap: woodTexture.arm,
  })
);
baseMesh.rotation.x = Math.PI / -2;

scene.add(baseMesh);

// Brick Walll
const wallMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    map: brickTexture.color,
    normalMap: brickTexture.normal,
    aoMap: brickTexture.arm,
    roughnessMap: brickTexture.arm,
    metalnessMap: brickTexture.arm,
  })
);
wallMesh.position.z = -5;
wallMesh.position.y = 5;

scene.add(wallMesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 5, 4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.y = 3.5;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,

  // MSAA - has some perf impact. Not needed if screen pixel ratio > 1
  antialias: window.devicePixelRatio === 1,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// Tone mapping
renderer.toneMapping = THREE.ReinhardToneMapping;
gui.add(renderer, "toneMapping", {
  NoToneMapping: THREE.NoToneMapping,
  LinearToneMapping: THREE.LinearToneMapping,
  ReinhardToneMapping: THREE.ReinhardToneMapping, // kind of washed out but may look more realistic
  CineonToneMapping: THREE.CineonToneMapping,
  ACESFilmicToneMapping: THREE.ACESFilmicToneMapping, // looks nicest
});

renderer.toneMappingExposure = 3;
gui.add(renderer, "toneMappingExposure").min(1).max(10).step(0.001);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
