import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Loaders

const gltfLoader = new GLTFLoader();

// Scene
const scene = new THREE.Scene();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.x = 3;
dirLight.position.z = 1;
scene.add(dirLight);

// Models

let duckModel = null;
gltfLoader.load("/models/Duck/glTF-Binary/Duck.glb", (gltf) => {
  duckModel = gltf.scene;
  scene.add(duckModel);
  console.log({ duckModel });
});

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshStandardMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

[object1, /*object2,*/ object3].forEach((o) => {
  scene.add(o);

  // we need to do that to get proper intersection distances in raycast result
  // probably not an issue if that was run inside the render loop
  o.updateMatrixWorld();
});

/**
 * Raycaster
 */

const raycaster = new THREE.Raycaster();

let currentIntersect = null;

// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(1, 0, 0); // alwyas needs to be normalized
// raycaster.set(rayOrigin, rayDirection);

// const intersection = raycaster.intersectObject(object1);
// console.log(intersection);

// const intersections = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersections);

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
 * Curosr
 */
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = ((event.clientY / sizes.height) * 2 - 1) * -1;
});

window.addEventListener("click", (event) => {
  if (currentIntersect) {
    console.log("mouse click", currentIntersect);
    currentIntersect.material.color.set("green");
  }
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let et = 0;

const tick = () => {
  const dt = clock.getDelta();
  et += dt;

  // animations
  object1.position.y = Math.sin(et * 0.3);
  object2.position.y = Math.sin(et * 0.5);
  object3.position.y = Math.cos(et * 0.7);

  // raycast

  const objects = [object1, object2, object3];

  //   const rayOrigin = new THREE.Vector3(-3, 0, 0);
  //   const rayDir = new THREE.Vector3(1, 0, 0);
  //   raycaster.set(rayOrigin, rayDir.normalize());

  raycaster.setFromCamera(mouse, camera);

  const intersections = raycaster.intersectObjects(objects);
  const intersected = intersections.map((it) => it.object);

  // handle intersections

  //   objects.forEach((o) => {
  //     o.material.color.set("red");
  //     // if (intersected.includes(o)) {
  //     //   o.material.color.set("blue");
  //     // } else {
  //     //   o.material.color.set("red");
  //     // }
  //   });

  //   intersected.forEach((o) => {
  //     o.material.color.set("blue");
  //   });

  // primitive simulation of events
  if (intersected.length) {
    const target = intersected[0];
    if (currentIntersect == null) {
      console.log("mouse enter", target);
      target.material.color.set("blue");
    }
    currentIntersect = target;
  } else {
    if (currentIntersect != null) {
      console.log("mouse leave", currentIntersect);
      currentIntersect.material.color.set("red");
    }

    currentIntersect = null;
  }

  //// duck intersections
  if (duckModel) {
    const duckInteresctions = raycaster.intersectObject(duckModel);
    if (duckInteresctions.length > 0) {
      // duck intersection
      duckModel.scale.set(1.2, 1.2, 1.2);
    } else {
      duckModel.scale.set(1, 1, 1);
    }
  }

  //   console.log(modelIntersects);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
