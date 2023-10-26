import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const particleTextures = {
  color: textureLoader.load("/textures/particles/9.png"),
};

/**
 * Particles
 */

// geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

const vertices = [];
const colors = [];
const particlesCount = 50000;

for (let i = 0; i < particlesCount; i++) {
  const x = THREE.MathUtils.randFloatSpread(10);
  const y = THREE.MathUtils.randFloatSpread(10);
  const z = THREE.MathUtils.randFloatSpread(10);
  vertices.push(x, y, z);

  const r = Math.random();
  const g = Math.random();
  const b = Math.random();
  colors.push(r, g, b);
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(vertices, 3)
);
particlesGeometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(colors, 3)
);

// material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  //   color: 0xff0000,
  alphaMap: particleTextures.color,
  transparent: true,

  // // make sure the particle bg is not rendered at all to avoid
  // // bugs with alpha related to render order
  // // not quite perfect if you look very closely at particles intersecting
  // alphaTest: 0.001,

  // // bugs our when there are other objects or particles of different colors
  // depthTest: false,

  // seems to be the best solution? no downside/bug was presented
  depthWrite: false,
});

// impacts the looks & performance
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;

// points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial()
);
// scene.add(cube);

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
camera.position.z = 3;
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update particles
  particles.rotation.y = elapsedTime / 10;

  //  // generally avoid - too many particles to update in a loop - causes perf issues when there aremany particles
  //   for (let i = 0; i < particlesCount; i++) {
  //     const i3 = i * 3;

  //     const x = i3;
  //     const y = i3 + 1;
  //     const z = i3 + 2;

  //     particlesGeometry.attributes.position.array[y] = Math.sin(
  //       elapsedTime + particlesGeometry.attributes.position.array[x]
  //     );
  //   }

  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
