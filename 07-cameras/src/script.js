import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Cursor
 */
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.x = (event.clientX / sizes.width - 0.5) * 2;
  cursor.y = (event.clientY / sizes.height - 0.5) * -2;
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Sizes
const sizes = {
  width: 1100,
  height: 800,
};

// Scene
const scene = new THREE.Scene();

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
scene.add(mesh);

// Camera
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 100);
// const camera = new THREE.OrthographicCamera(
//   // aspect ratio needed to avoid distortion
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// );
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 3;
// camera.lookAt(mesh.position);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// controls.target.y = 2; // looking above the cube
// controls.update();

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  //   mesh.rotation.y = elapsedTime;

  //   // move camera on a plane
  //   camera.position.x = cursor.x * 3;
  //   camera.position.y = cursor.y * 3;
  //   camera.lookAt(mesh.position);

  // move camera on a cylinder
  //   camera.position.x = Math.sin(cursor.x * Math.PI) * 2;
  //   camera.position.z = Math.cos(cursor.x * Math.PI) * 2;
  //   camera.position.y = cursor.y * 4;
  //   camera.lookAt(mesh.position);

  // Render
  renderer.render(scene, camera);
  controls.update(); // needed for the controls dumping to work

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
