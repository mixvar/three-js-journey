import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * TODO ideas
 * - slow spin of the galaxy
 * - custom texture for the particles
 * - distribute stars so that there are fewer with increasing distance from the center of galaxy
 * - make stars more distant from arm center increasingly transparent
 * - improve arm distance distribution to be more natural
 */

/**
 * Base
 */
// Debug
const gui = new dat.GUI({
  width: 400,
});

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {
  starCount: 300000,
  starSize: 0.0001,
  radius: 6,
  arms: 5,
  spin: -0.9,
  randomnessPower: 2.5,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
};

const galaxy = {
  geometry: null,
  material: null,
  points: null,
};

const generateGalaxy = () => {
  console.log("generate galaxy");

  // destroy old galaxy
  if (galaxy.points != null) {
    galaxy.geometry.dispose();
    galaxy.material.dispose();
    scene.remove(galaxy.points);
  }

  /**
   * geometry
   */

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  const vertices = new Float32Array(parameters.starCount * 3);
  const colors = new Float32Array(parameters.starCount * 3);

  for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
    // position
    const radius = Math.random() * parameters.radius;
    const selectedArm = j % parameters.arms;
    const armAngleIncrement = (2 * Math.PI) / parameters.arms;
    const armAngle = selectedArm * armAngleIncrement;
    const spinAngle = radius * parameters.spin;

    const getRandomness = () =>
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    const x = Math.sin(armAngle + spinAngle) * radius + getRandomness();
    const z = Math.cos(armAngle + spinAngle) * radius + getRandomness();
    const y = getRandomness();

    vertices[i] = x;
    vertices[i + 1] = y;
    vertices[i + 2] = z;

    // color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colors[i] = mixedColor.r;
    colors[i + 1] = mixedColor.g;
    colors[i + 2] = mixedColor.b;
  }

  galaxy.geometry = new THREE.BufferGeometry();
  galaxy.geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  galaxy.geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  /**
   * material
   */
  galaxy.material = new THREE.PointsMaterial({
    size: parameters.starSize,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  /**
   * points
   */
  galaxy.points = new THREE.Points(galaxy.geometry, galaxy.material);
  scene.add(galaxy.points);
};

generateGalaxy();

// tweaks
gui
  .add(parameters, "starCount")
  .min(100)
  .max(500000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "starSize")
  .min(0.0001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "arms")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

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
  0.001,
  1000
);
camera.position.x = 3;
camera.position.y = 3;
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

  // animate galaxy
  galaxy.points.rotation.y =
    (elapsedTime / 15) * (parameters.spin < 0 ? 1 : -1);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
