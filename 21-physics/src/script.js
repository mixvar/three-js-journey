import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import * as Cannon from "cannon-es";

THREE.ColorManagement.enabled = false;

/**
 * Debug
 */
const gui = new dat.GUI();

const debugOject = {
  createSphere: () =>
    createSphere(Math.random() * 0.3 + 0.2, {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    }),

  createBox: () =>
    createBox(
      Math.random() * 0.3 + 0.2,
      Math.random() * 0.3 + 0.2,
      Math.random() * 0.3 + 0.2,
      {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      }
    ),

  reset: () => {
    console.log("reset");
    for (const obj of objectsToUpdate) {
      obj.body.removeEventListener("collide", playHitSound);
      physicsWorld.removeBody(obj.body);
      scene.remove(obj.mesh);
    }
    objectsToUpdate.splice(0, objectsToUpdate.length);
  },
};

gui.add(debugOject, "createSphere");
gui.add(debugOject, "createBox");
gui.add(debugOject, "reset");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sounds
 */

const hitSound = new Audio("/sounds/hit.mp3");

const playHitSound = (collisionEvent) => {
  const impactV = collisionEvent.contact.getImpactVelocityAlongNormal();

  if (impactV > 1.5) {
    // volume scaled based on impact velocity
    const volume = (Math.min(impactV, 7) - 1.5) / 5.5;
    hitSound.volume = volume;

    // makes it possible to play multipel sounds at the same time
    hitSound.currentTime = 0;

    hitSound.play();
  }
};

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const envMapIndex = 0;
const environmentMapTexture = cubeTextureLoader.load([
  `/textures/environmentMaps/${envMapIndex}/px.png`,
  `/textures/environmentMaps/${envMapIndex}/nx.png`,
  `/textures/environmentMaps/${envMapIndex}/py.png`,
  `/textures/environmentMaps/${envMapIndex}/ny.png`,
  `/textures/environmentMaps/${envMapIndex}/pz.png`,
  `/textures/environmentMaps/${envMapIndex}/nz.png`,
]);

/**
 * Physics
 */

// world
const physicsWorld = new Cannon.World();
physicsWorld.gravity.set(0, -9.82, 0);

// much improved perf but collision detecton is more bug-prone at hight speed
physicsWorld.broadphase = new Cannon.SAPBroadphase(physicsWorld);

// further improve perf - slow moving objects are marked as sleeping to disable some calculations
physicsWorld.allowSleep = true;

// materials
// for controlling bounciness & friction
// usually we can just have default material
const physicsMaterials = {
  //   concrete: new Cannon.Material("concrete"),
  //   plastic: new Cannon.Material("plastic"),
  default: new Cannon.Material("default"),
};

const physicsMaterialInteractions = {
  //   concretePlastic: new Cannon.ContactMaterial(
  //     physicsMaterials.concrete,
  //     physicsMaterials.plastic,
  //     { friction: 0.1, restitution: 7 }
  //   ),
  default: new Cannon.ContactMaterial(
    physicsMaterials.default,
    physicsMaterials.default,
    { friction: 0.1, restitution: 0.7 }
  ),
};

physicsWorld.addContactMaterial(physicsMaterialInteractions.default);
physicsWorld.defaultContactMaterial = physicsMaterialInteractions.default;

// // sphere
// const sphereShape = new Cannon.Sphere(0.5);
// const sphereBody = new Cannon.Body({
//   mass: 1,
//   position: new Cannon.Vec3(0, 3, 0),
//   shape: sphereShape,
//   //   material: physicsMaterials.plastic,
// });
// // apply initial force - like a kick
// sphereBody.applyLocalForce(
//   new Cannon.Vec3(150, 0, 0),
//   new Cannon.Vec3(0, 0, 0)
// );
// physicsWorld.addBody(sphereBody);

// floor
const floorShape = new Cannon.Plane();
const floorBody = new Cannon.Body();
floorBody.mass = 0; // make the object static
floorBody.quaternion.setFromAxisAngle(new Cannon.Vec3(1, 0, 0), Math.PI / -2);
floorBody.addShape(floorShape);
// floorBody.material = physicsMaterials.concrete;

physicsWorld.addBody(floorBody);

// /**
//  * Test sphere
//  */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 3;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];

const objectMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const createSphere = (radius, position) => {
  // three js
  const mesh = new THREE.Mesh(sphereGeometry, objectMaterial);
  mesh.castShadow = true;
  mesh.position.copy(position);
  mesh.scale.multiplyScalar(radius);
  scene.add(mesh);

  // cannon body
  const shape = new Cannon.Sphere(radius);
  const body = new Cannon.Body({
    mass: 1,
    shape,
    material: physicsMaterials.default,
  });

  body.position.copy(position);
  body.addEventListener("collide", playHitSound);

  physicsWorld.addBody(body);

  // save
  objectsToUpdate.push({ mesh, body });
};

const createBox = (width, height, depth, position) => {
  // three js
  const mesh = new THREE.Mesh(boxGeometry, objectMaterial);
  mesh.castShadow = true;
  mesh.position.copy(position);
  mesh.scale.set(width, height, depth);
  scene.add(mesh);

  // cannon body
  const shape = new Cannon.Box(
    new Cannon.Vec3(width / 2, height / 2, depth / 2)
  );
  const body = new Cannon.Body({
    mass: 1,
    shape,
    material: physicsMaterials.default,
  });

  body.position.copy(position);
  body.addEventListener("collide", playHitSound);

  physicsWorld.addBody(body);

  // save
  objectsToUpdate.push({ mesh, body });
};

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const deltaTime = clock.getDelta();

  // update physics world
  //   sphereBody.applyForce(new Cannon.Vec3(-0.5, 0, 0), sphereBody.position);

  // apply wind
  objectsToUpdate.forEach(({ body }) => {
    body.applyForce(new Cannon.Vec3(-0.2, 0, 0), body.position);
  });

  physicsWorld.step(1 / 60, deltaTime, 3);

  // sync worlds
  objectsToUpdate.forEach(({ mesh, body }) => {
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);
  });

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
