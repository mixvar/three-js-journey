import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { GroundProjectedSkybox } from "three/examples/jsm/objects/GroundProjectedSkybox";
import GUI from "lil-gui";

// Layers

const Layers = {
  Default: 0,
  EnvMap: 1,
};

// Debug
const gui = new GUI();

const globalParams = {};

/**
 * Loaders
 */

const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const rgbeLoader = new RGBELoader();
const exrLoader = new EXRLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Env maps
 */

globalParams.envMapIntensity = 1;
gui
  .add(globalParams, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(() => updateAllMaterials());

const envMapId = 2;

// 1
// LDR cube texture
// const envMap = cubeTextureLoader.load([
//   `environmentMaps/${envMapId}/px.png`,
//   `environmentMaps/${envMapId}/nx.png`,
//   `environmentMaps/${envMapId}/py.png`,
//   `environmentMaps/${envMapId}/ny.png`,
//   `environmentMaps/${envMapId}/pz.png`,
//   `environmentMaps/${envMapId}/nz.png`,
// ]);

// 2
// HDR (RGBE) equirectangular
// HDR gives much better effect out of the box, we don't need to
// tweak intesity of the envMap to get good effect
// downside is larger size of the file
// rgbeLoader.load(`environmentMaps/${envMapId}/2k.hdr`, (it) => {
//   it.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = it;
//   scene.environment = it;
// });

// rgbeLoader.load(`environmentMaps/blender-2k.hdr`, (it) => {
//   it.mapping = THREE.EquirectangularReflectionMapping;
//   //   scene.background = it;
//   scene.environment = it;
// });

// exrLoader.load(`environmentMaps/nvidiaCanvas-4k.exr`, (it) => {
//   it.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = it;
//   scene.environment = it;
// });

// LDR equirectangular
// const envMap = textureLoader.load(
//   "./environmentMaps/blockadesLabsSkybox/Digital_Painting_equirectangular-jpg_old_castle_ruins_in_1351866254_9437216.jpg"
// );
// envMap.mapping = THREE.EquirectangularReflectionMapping;
// envMap.colorSpace = THREE.SRGBColorSpace;

// // ground projected env map
// rgbeLoader.load(`environmentMaps/${envMapId}/2k.hdr`, (it) => {
//   it.mapping = THREE.EquirectangularReflectionMapping;
//   //   scene.background = it;
//   scene.environment = it;

//   const skybox = new GroundProjectedSkybox(it);
//   skybox.scale.setScalar(50);
//   scene.add(skybox);

//   gui.add(skybox, "radius", 0, 200, 0.1).name("skyboxRadius");
//   gui.add(skybox, "height", 0, 200, 0.1).name("skyboxHeight");
// });

/**
 * Real time env map
 */

const envMap = textureLoader.load(
  "./environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg"
);
envMap.mapping = THREE.EquirectangularReflectionMapping;
envMap.colorSpace = THREE.SRGBColorSpace;

// holy donut
const holyDonut = new THREE.Mesh(
  new THREE.TorusGeometry(10, 0.5),
  new THREE.MeshBasicMaterial({
    // value greater than 1 works because we used Three.HalfFloatType
    color: new THREE.Color(10, 4, 2),
  })
);
holyDonut.position.y = 3.5;
holyDonut.layers.set(Layers.EnvMap);

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
  type: THREE.HalfFloatType, // kind of hdr effect - wide range of colors?
});

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.layers.set(Layers.EnvMap);

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

scene.background = envMap;
// scene.environment = envMap;

scene.add(holyDonut);

// we render our own env map on every frame
scene.environment = cubeRenderTarget.texture;

scene.backgroundBlurriness = 0;
gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001);

scene.backgroundIntensity = 1;
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001);

// update all maerials
// we can't tweak envMapIntensity globally
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    )
      child.material.envMapIntensity = globalParams.envMapIntensity;
  });
};

/**
 * Torus Knot
 */
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.15,
    metalness: 1,
    color: 0xaaaaaa,
  })
);
// torusKnot.material.envMap = envMap;
torusKnot.position.y = 4;
torusKnot.position.x = -4;
scene.add(torusKnot);

/**
 * Helmet Model
 */

gltfLoader.load("models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.multiplyScalar(10);
  scene.add(gltf.scene);
  updateAllMaterials();
});

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
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
const tick = () => {
  // Time
  const elapsedTime = clock.getElapsedTime();

  // real time env map
  if (holyDonut) {
    holyDonut.rotation.x = elapsedTime * 4;

    cubeCamera.update(renderer, scene);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
