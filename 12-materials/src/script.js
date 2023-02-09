import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Pane } from "tweakpane";

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/7.png");
const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/1/px.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/py.jpg",
  "/textures/environmentMaps/1/ny.jpg",
  "/textures/environmentMaps/1/pz.jpg",
  "/textures/environmentMaps/1/nz.jpg",
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Light
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.6);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Objects
 */

// A
// const material = new THREE.MeshBasicMaterial();
// // material.color.set(0xff00ff);
// // material.opacity = 0.4;
// material.transparent = true;
// material.side = THREE.DoubleSide;
// material.map = doorColorTexture;
// material.alphaMap = doorAlphaTexture;

// B
// const material = new THREE.MeshNormalMaterial();
// material.side = THREE.DoubleSide;
// material.flatShading = true;

// C
// // this creates illusion of having illumination
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;
// material.side = THREE.DoubleSide;

// D
// const material = new THREE.MeshDepthMaterial();
// material.side = THREE.DoubleSide;

// E
// first material that requires light
// good performance but does create artifact patterns
// const material = new THREE.MeshLambertMaterial();
// material.side = THREE.DoubleSide;

// F
// less performance, better visuals
// const material = new THREE.MeshPhongMaterial();
// material.side = THREE.DoubleSide;
// material.shininess = 100;
// material.specular.set("blue"); // blue reflection

// G
// const material = new THREE.MeshToonMaterial();
// material.side = THREE.DoubleSide;
// material.gradientMap = gradientTexture;
// material.flatShading = true;

// H
// similar to Lambert and Phong but better, different params
// based on physically based rendering principles
// const material = new THREE.MeshStandardMaterial();
// material.side = THREE.DoubleSide;
// // material.metalness = 0.3;
// // material.roughness = 0.6;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;

// I
const material = new THREE.MeshStandardMaterial();
material.side = THREE.DoubleSide;
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = envMapTexture;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 50, 50), material);
sphere.position.x = -1.2;
sphere.geometry.setAttribute(
  // needed for AO map to work
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  // needed for AO map to work
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.2;
torus.geometry.setAttribute(
  // needed for AO map to work
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

scene.add(sphere, plane, torus);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// GUI

const gui = new Pane({ title: "Params" });
gui.addInput(material, "wireframe");
gui.addInput(material, "metalness", { min: 0, max: 1, step: 0.001 });
gui.addInput(material, "roughness", { min: 0, max: 1, step: 0.001 });
gui.addInput(material, "aoMapIntensity", { min: 0, max: 2, step: 0.001 });
gui.addInput(material, "displacementScale", { min: 0, max: 1, step: 0.001 });

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

  // Update objects
  sphere.rotation.y = elapsedTime * 0.2;
  plane.rotation.y = elapsedTime * 0.2;
  torus.rotation.y = elapsedTime * 0.2;

  //   sphere.rotation.x = elapsedTime * 0.2;
  //   plane.rotation.x = elapsedTime * 0.2;
  //   torus.rotation.x = elapsedTime * 0.2;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
