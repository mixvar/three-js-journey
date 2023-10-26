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

// fog
const fog = new THREE.Fog("#262837", 1, 18);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorTextures = {
  alpha: textureLoader.load("/textures/door/alpha.jpg"),
  color: textureLoader.load("/textures/door/color.jpg"),
  ambientOcclusion: textureLoader.load("/textures/door/ambientOcclusion.jpg"),
  height: textureLoader.load("/textures/door/height.jpg"),
  metalness: textureLoader.load("/textures/door/metalness.jpg"),
  normal: textureLoader.load("/textures/door/normal.jpg"),
  roughness: textureLoader.load("/textures/door/roughness.jpg"),
};

const brickTextures = {
  ao: textureLoader.load("/textures/bricks/ambientOcclusion.jpg"),
  color: textureLoader.load("/textures/bricks/color.jpg"),
  normal: textureLoader.load("/textures/bricks/normal.jpg"),
  roughness: textureLoader.load("/textures/bricks/roughness.jpg"),
};

const grassTextures = {
  ao: textureLoader.load("/textures/grass/ambientOcclusion.jpg"),
  color: textureLoader.load("/textures/grass/color.jpg"),
  normal: textureLoader.load("/textures/grass/normal.jpg"),
  roughness: textureLoader.load("/textures/grass/roughness.jpg"),
};
Object.values(grassTextures).forEach((texture) => {
  texture.repeat.set(40, 40);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
});

/**
 * House
 */

// group
const house = new THREE.Group();
scene.add(house);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: brickTextures.color,
    aoMap: brickTextures.ao,
    normalMap: brickTextures.normal,
    roughnessMap: brickTextures.roughness,
  })
);
walls.position.y = 2.5 / 2;
house.add(walls);

// roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5 + 1 / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: doorTextures.color,
    alphaMap: doorTextures.alpha,
    aoMap: doorTextures.ambientOcclusion,
    normalMap: doorTextures.normal,
    metalnessMap: doorTextures.metalness,
    roughnessMap: doorTextures.roughness,
    displacementMap: doorTextures.height,
    displacementScale: 0.1,
  })
);
door.position.z = 4 / 2 + 0.001;
door.position.y = 2 / 2;
house.add(door);

// bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);

bush1.scale.multiplyScalar(0.5);
bush1.position.set(0.8, 0.2, 2.2);

bush2.scale.multiplyScalar(0.25);
bush2.position.set(1.4, 0.1, 2.1);

bush3.scale.multiplyScalar(0.4);
bush3.position.set(-0.8, 0.1, 2.2);

bush4.scale.multiplyScalar(0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const angle = Math.random() * Math.PI * 2;
  const radius = 3.5 + Math.random() * 5.5;
  grave.position.x = Math.sin(angle) * radius;
  grave.position.z = Math.cos(angle) * radius;
  grave.position.y = 0.8 / 2 - 0.1;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({
    map: grassTextures.color,
    aoMap: grassTextures.ao,
    normalMap: grassTextures.normal,
    roughnessMap: grassTextures.roughness,
  })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.1);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.15);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

// ghosts
const ghosts = new THREE.Group();
scene.add(ghosts);

const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);

ghosts.add(ghost1, ghost2, ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.setClearColor(new THREE.Color("#262837"));
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

graves.children.forEach((grave) => {
  grave.castShadow = true;
});

floor.receiveShadow = true;

// optimize shadows
[doorLight, ghost1, ghost2, ghost3].forEach((light) => {
  light.shadow.mapSize.width = 256;
  light.shadow.mapSize.height = 256;
  light.shadow.camera.far = 7;
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // up date ghosts
  const ghos1tAngle = elapsedTime * 0.5;
  ghost1.position.x = Math.sin(ghos1tAngle) * 4;
  ghost1.position.z = Math.cos(ghos1tAngle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghos2tAngle = elapsedTime * -0.32;
  ghost2.position.x = Math.sin(ghos2tAngle) * 5;
  ghost2.position.z = Math.cos(ghos2tAngle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghos3tAngle = elapsedTime * -0.18;
  ghost3.position.x =
    Math.sin(ghos3tAngle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.cos(ghos3tAngle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
