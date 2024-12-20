import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });

const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512);

// Color

debugObject.depthColor = "#0f1566";
debugObject.surfaceColor = "#0062ff";

// Material
const uniforms = {
  uTime: { value: 0 },

  uBigWavesSpeed: { value: 0.7 },
  uBigWavesElevation: { value: 0.2 },
  uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },

  uSmallWavesSpeed: { value: 0.3 },
  uSmallWavesElevation: { value: 0.1 },
  uSmallWavesFrequency: { value: 3 },
  uSmallWavesIterations: { value: 4 },

  uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
  uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
};

const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  wireframe: false,
  uniforms,
});

gui
  .add(uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWavesElevation");

gui
  .add(uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uBigWavesSpeed");

gui
  .add(uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequency.x");

gui
  .add(uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequency.y");

gui
  .add(uniforms.uSmallWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uSmallWavesSpeed");

gui
  .add(uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWavesElevation");

gui
  .add(uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uSmallWavesFrequency");

gui
  .add(uniforms.uSmallWavesIterations, "value")
  .min(0)
  .max(8)
  .step(1)
  .name("uSmallWavesIterations");

gui.addColor(debugObject, "depthColor").onChange(() => {
  uniforms.uDepthColor.value.set(debugObject.depthColor);
});

gui.addColor(debugObject, "surfaceColor").onChange(() => {
  uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

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
camera.position.set(1, 1, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
