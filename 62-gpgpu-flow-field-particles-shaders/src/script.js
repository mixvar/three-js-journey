import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import GUI from "lil-gui";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";
import gpgpuParticlesShader from "./shaders/gpgpu/particles.glsl";

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

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Materials
  particles.material.uniforms.uResolution.value.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4.5, 4, 11);
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
renderer.setPixelRatio(sizes.pixelRatio);

debugObject.clearColor = "#29191f";
renderer.setClearColor(debugObject.clearColor);

/** Load model */
const gltf = await gltfLoader.loadAsync("./model.glb");

/**
 * Base geometry
 */

const baseGeometry = {};
// baseGeometry.instance = new THREE.SphereGeometry(3);
baseGeometry.instance = gltf.scene.children[0].geometry;
baseGeometry.count = baseGeometry.instance.attributes.position.count;

/**
 * GPU Compute
 */
const gpgpu = {};
gpgpu.size = Math.ceil(Math.sqrt(baseGeometry.count)); // basic square texture - we need at least 1 pixel per particle

gpgpu.computation = new GPUComputationRenderer(
  gpgpu.size,
  gpgpu.size,
  renderer
);

// texture with initial data
gpgpu.baseParticlesTexture = gpgpu.computation.createTexture();

// copy positions from geometry to data texture rgb channels, ignore alpha
for (let i = 0; i < baseGeometry.count; i++) {
  const i3 = i * 3;
  const i4 = i * 4;

  const sourceArray = baseGeometry.instance.attributes.position.array;
  const targetArray = gpgpu.baseParticlesTexture.image.data;

  targetArray[i4 + 0] = sourceArray[i3 + 0]; // R
  targetArray[i4 + 1] = sourceArray[i3 + 1]; // G
  targetArray[i4 + 2] = sourceArray[i3 + 2]; // B
  targetArray[i4 + 3] = Math.random(); // A
}

// set up gpgpu computation via our gpgpuParticlesShader
gpgpu.particlePositionsVariable = gpgpu.computation.addVariable(
  "uParticlePositionsTexture",
  gpgpuParticlesShader,
  gpgpu.baseParticlesTexture
);

// set-up loop for continues re-calculation of positions
gpgpu.computation.setVariableDependencies(gpgpu.particlePositionsVariable, [
  gpgpu.particlePositionsVariable,
]);

gpgpu.particlePositionsVariable.material.uniforms.uTime = new THREE.Uniform(0);
gpgpu.particlePositionsVariable.material.uniforms.uDeltaTime =
  new THREE.Uniform(0);
gpgpu.particlePositionsVariable.material.uniforms.uBaseTexture =
  new THREE.Uniform(gpgpu.baseParticlesTexture);
gpgpu.particlePositionsVariable.material.uniforms.uFlowFieldInfluence =
  new THREE.Uniform(0.5);
gpgpu.particlePositionsVariable.material.uniforms.uFlowFieldStrength =
  new THREE.Uniform(2);
gpgpu.particlePositionsVariable.material.uniforms.uFlowFieldFrequency =
  new THREE.Uniform(0.5);

gpgpu.computation.init();

// Helpers
gpgpu.getParticlesTexture = () =>
  gpgpu.computation.getCurrentRenderTarget(gpgpu.particlePositionsVariable)
    .texture;

// DEBUG
gpgpu.debug = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3),
  new THREE.MeshBasicMaterial()
);
gpgpu.debug.position.x = 6;
gpgpu.debug.material.map = gpgpu.getParticlesTexture();
gpgpu.debug.visible = false;

scene.add(gpgpu.debug);

/**
 * Particles
 */
const particles = {};

// Geometry

// prepare UV coordinates for reading the data texture in points vertex shader
particles.uvArray = new Float32Array(baseGeometry.count * 2);
for (let y = 0; y < gpgpu.size; y++) {
  for (let x = 0; x < gpgpu.size; x++) {
    const i = y * gpgpu.size + x;
    const i2 = i * 2;

    const uvX = (x + 0.5) / gpgpu.size;
    const uvY = (y + 0.5) / gpgpu.size;

    particles.uvArray[i2 + 0] = uvX;
    particles.uvArray[i2 + 1] = uvY;
  }
}

particles.sizesArray = new Float32Array(baseGeometry.count);
for (let i = 0; i < baseGeometry.count; i++) {
  particles.sizesArray[i] = Math.random();
}

particles.geometry = new THREE.BufferGeometry();
particles.geometry.setDrawRange(0, baseGeometry.count);
particles.geometry.setAttribute(
  "aParticlesUv",
  new THREE.BufferAttribute(particles.uvArray, 2)
);
particles.geometry.setAttribute(
  "aParticleSize",
  new THREE.BufferAttribute(particles.sizesArray, 1)
);
particles.geometry.setAttribute(
  "aColor",
  baseGeometry.instance.attributes.color // copy color attr that was baked into each vertex in Blender
);

// Material
particles.material = new THREE.ShaderMaterial({
  vertexShader: particlesVertexShader,
  fragmentShader: particlesFragmentShader,
  uniforms: {
    uSize: new THREE.Uniform(0.05),
    uResolution: new THREE.Uniform(
      new THREE.Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    ),
    uParticlesTexture: new THREE.Uniform(),
  },
});

// Points
particles.points = new THREE.Points(particles.geometry, particles.material);
particles.points.frustumCulled = false;
scene.add(particles.points);

/**
 * Tweaks
 */
gui.add(gpgpu.debug, "visible").name("show data texture");

gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});
gui
  .add(particles.material.uniforms.uSize, "value")
  .min(0)
  .max(0.1)
  .step(0.001)
  .name("uSize");
gui
  .add(
    gpgpu.particlePositionsVariable.material.uniforms.uFlowFieldInfluence,
    "value"
  )
  .min(0)
  .max(1)
  .step(0.001)
  .name("uFlowFieldInfluence");
gui
  .add(
    gpgpu.particlePositionsVariable.material.uniforms.uFlowFieldStrength,
    "value"
  )
  .min(0)
  .max(10)
  .step(0.1)
  .name("uFlowFieldStrength");
gui
  .add(
    gpgpu.particlePositionsVariable.material.uniforms.uFlowFieldFrequency,
    "value"
  )
  .min(0)
  .max(1)
  .step(0.001)
  .name("uFlowFieldFrequency");

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // GPGPU
  gpgpu.particlePositionsVariable.material.uniforms.uTime.value = elapsedTime;
  gpgpu.particlePositionsVariable.material.uniforms.uDeltaTime.value =
    deltaTime;

  gpgpu.computation.compute();

  particles.material.uniforms.uParticlesTexture.value =
    gpgpu.getParticlesTexture();

  // Render normal scene
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

console.log({ baseGeometry, gpgpu, particles });

tick();
