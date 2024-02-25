import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import firefliesVertexShader from "./shaders/fireflies/vertex.glsl";
import firefliesFragShader from "./shaders/fireflies/fragment.glsl";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragShader from "./shaders/portal/fragment.glsl";

/**
 * Base
 */
// Debug
const debugObject = {};

const gui = new GUI({
  width: 400,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// Draco loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("draco/");

// GLTF loader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Textures
 */
const bakedTexture = textureLoader.load("baked.jpg");
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Materials
 */
const bakedMaterial = new THREE.MeshBasicMaterial({
  map: bakedTexture,
});

const poleLightMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffe5,
});

/**
 * Portal
 */
const portalUniforms = {
  uTime: { value: 0 },
  uColorInner: { value: new THREE.Color(0x040208) },
  uColorOuter: { value: new THREE.Color(0xfcfaff) },
};

const portalMaterial = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragShader,
  uniforms: portalUniforms,
});

gui.addColor(portalUniforms.uColorInner, "value").name("portalColorInner");
gui.addColor(portalUniforms.uColorOuter, "value").name("portalColorOuter");

/**
 * Model
 */
gltfLoader.load("portal.glb", (glb) => {
  glb.scene.traverse((object) => {
    if (object.name.startsWith("POLE_LIGHT")) {
      object.material = poleLightMaterial;
    } else if (object.name === "PORTAL_SURFACE") {
      object.material = portalMaterial;
    } else if (object.material) {
      // also a single object, could be found by name now
      object.material = bakedMaterial;
    }
  });

  scene.add(glb.scene);
});

/**
 * Fireflies
 */
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;

const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount * 1);

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = Math.random() * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

  scaleArray[i] = Math.random() + 0.5;
}

firefliesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);
firefliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArray, 1)
);

const firefliesUniforms = {
  uTime: { value: 0 },
  uSize: { value: 100 },
  uPixelRatio: { value: 1 },
};

const firefliesMaterial = new THREE.ShaderMaterial({
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragShader,
  uniforms: firefliesUniforms,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

gui
  .add(firefliesUniforms.uSize, "value")
  .min(0)
  .max(200)
  .step(1)
  .name("firefly size");

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
  firefliesUniforms.uPixelRatio.value = renderer.getPixelRatio();
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
firefliesUniforms.uPixelRatio.value = renderer.getPixelRatio();

debugObject.clearColor = "#201009";
renderer.setClearColor(debugObject.clearColor);
gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  portalUniforms.uTime.value = elapsedTime;
  firefliesUniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
