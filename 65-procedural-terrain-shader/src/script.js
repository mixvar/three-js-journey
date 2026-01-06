import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import GUI from "lil-gui";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

import terrainVertexShader from "./shaders/terrain/vertex.glsl";
import terrainFragmentShader from "./shaders/terrain/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 325 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const rgbeLoader = new RGBELoader();

/**
 * Environment map
 */
rgbeLoader.load("/spruit_sunrise.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.backgroundBlurriness = 0.5;
  scene.environment = environmentMap;
});

/**
 * Terrain
 */
const geometry = new THREE.PlaneGeometry(10, 10, 500, 500);
geometry.rotateX(-Math.PI * 0.5); // rotating the geometry impacts coordinate system in the shader
geometry.deleteAttribute("normal");
geometry.deleteAttribute("uv");

debugObject.colorWaterDeep = "#002b3d";
debugObject.colorWaterSurface = "#66a8ff";
debugObject.colorSand = "#ffe894";
debugObject.colorGrass = "#85d534";
debugObject.colorSnow = "#ffffff";
debugObject.colorRock = "#bfbd8d";

const uniforms = {
  uPositionFrequency: new THREE.Uniform(0.2),
  uWarpFrequency: new THREE.Uniform(5.0),
  uStrength: new THREE.Uniform(2.0),
  uWarpStrength: new THREE.Uniform(0.5),
  uTime: new THREE.Uniform(0),
  uSpeed: new THREE.Uniform(0.25),

  uColorWaterDeep: new THREE.Uniform(
    new THREE.Color(debugObject.colorWaterDeep)
  ),
  uColorWaterSurface: new THREE.Uniform(
    new THREE.Color(debugObject.colorWaterSurface)
  ),
  uColorSand: new THREE.Uniform(new THREE.Color(debugObject.colorSand)),
  uColorGrass: new THREE.Uniform(new THREE.Color(debugObject.colorGrass)),
  uColorSnow: new THREE.Uniform(new THREE.Color(debugObject.colorSnow)),
  uColorRock: new THREE.Uniform(new THREE.Color(debugObject.colorRock)),
};

const material = new CustomShaderMaterial({
  baseMaterial: THREE.MeshStandardMaterial,
  vertexShader: terrainVertexShader,
  fragmentShader: terrainFragmentShader,
  uniforms: uniforms,

  // MeshStandardMaterial
  color: "#85d534",
  metalness: 0,
  roughness: 0.3,
  side: THREE.DoubleSide,
});

const depthMaterial = new CustomShaderMaterial({
  baseMaterial: THREE.MeshDepthMaterial,
  vertexShader: terrainVertexShader,
  uniforms: uniforms,

  // MeshDepthMaterial
  depthPacking: THREE.RGBADepthPacking,
});

const terrainMesh = new THREE.Mesh(geometry, material);
terrainMesh.receiveShadow = true;
terrainMesh.castShadow = true;
terrainMesh.customDepthMaterial = depthMaterial;
scene.add(terrainMesh);

// WATER
const water = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 1, 1),
  new THREE.MeshPhysicalMaterial({
    transmission: 1,
    roughness: 0.2,
  })
);
water.rotateX(-Math.PI / 2);
water.position.y = -0.1;
scene.add(water);

/**
 * Board
 */
const boardFill = new Brush(new THREE.BoxGeometry(11, 2, 11));
const boardHole = new Brush(new THREE.BoxGeometry(10, 2.1, 10));
// boardHole.position.y = 0.2;
// boardHole.updateWorldMatrix(); // we need to force matrix update when making changes to brush position/rotation/scale - three does not do it automatically since it is not rendered

const evaluator = new Evaluator();

// materials from individual brushes get applied to the resulting geometry via vertex groups
// boardFill.material.color.set("red");
// boardHole.material.color.set("blue");

const board = evaluator.evaluate(boardFill, boardHole, SUBTRACTION);
board.geometry.clearGroups(); // we don't need multiple groups/materials here

board.material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  metalness: 0,
  roughness: 0.3,
});
board.castShadow = true;
board.receiveShadow = true;
console.log(board);
scene.add(board);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
directionalLight.position.set(6.25, 3, 4);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 30;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
scene.add(directionalLight);

// GUI
const terrainFolder = gui.addFolder("Terrain");
terrainFolder
  .add(uniforms.uSpeed, "value")
  .min(0)
  .max(10)
  .step(0.01)
  .name("uSpeed");
terrainFolder
  .add(uniforms.uPositionFrequency, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("positionFrequency");
terrainFolder
  .add(uniforms.uWarpFrequency, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("warpFrequency");
terrainFolder
  .add(uniforms.uStrength, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("strength");
terrainFolder
  .add(uniforms.uWarpStrength, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("warpStrength");

const colorsFolder = gui.addFolder("Colors");
colorsFolder
  .addColor(debugObject, "colorWaterDeep")
  .onChange(() =>
    uniforms.uColorWaterDeep.value.set(debugObject.colorWaterDeep)
  );
colorsFolder
  .addColor(debugObject, "colorWaterSurface")
  .onChange(() =>
    uniforms.uColorWaterSurface.value.set(debugObject.colorWaterSurface)
  );
colorsFolder
  .addColor(debugObject, "colorSand")
  .onChange(() => uniforms.uColorSand.value.set(debugObject.colorSand));
colorsFolder
  .addColor(debugObject, "colorGrass")
  .onChange(() => uniforms.uColorGrass.value.set(debugObject.colorGrass));
colorsFolder
  .addColor(debugObject, "colorSnow")
  .onChange(() => uniforms.uColorSnow.value.set(debugObject.colorSnow));
colorsFolder
  .addColor(debugObject, "colorRock")
  .onChange(() => uniforms.uColorRock.value.set(debugObject.colorRock));

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
camera.position.set(-10, 6, -2);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update uniforms
  uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
