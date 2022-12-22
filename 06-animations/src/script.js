import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

// timing
const clock = new THREE.Clock();

// animations - elapsed time
const tick1 = () => {
  // timing
  const et = clock.getElapsedTime();

  // apply animation update
  mesh.rotation.x = et * Math.PI * 2; // 1 revolution/s
  mesh.rotation.y = et;
  mesh.rotation.z = et;
  mesh.position.y = Math.sin(et);
  mesh.position.x = Math.cos(et);
  camera.position.z = Math.sin(et * 2) * 2 + 5;

  // render
  renderer.render(scene, camera);

  requestAnimationFrame(tick1);
};

// animations - delta time
let oscillator = 0;
const tick2 = () => {
  // timing
  // WARN: was advised against using getDelta, but can be replicated in vanilla JS
  const dt = clock.getDelta();
  oscillator += (dt % Math.PI) * 2;

  // apply animation update
  mesh.rotateX(dt * Math.PI * 2);
  mesh.rotateZ(dt);
  mesh.rotateY(dt);
  mesh.position.y += (Math.sin(oscillator) * 2) / 30;
  mesh.position.x += (Math.cos(oscillator) * 2) / 30;
  camera.position.z += Math.sin(oscillator) / 10;

  // render
  renderer.render(scene, camera);

  requestAnimationFrame(tick2);
};

// animations - GSAP lib
// GSAP manages its own animation loop
gsap.to(mesh.position, { x: 2, duration: 1, delay: 1 });
gsap.to(mesh.position, { x: -2, duration: 1, delay: 2 });
gsap.to(mesh.position, { x: 0, duration: 1, delay: 3 });

const tick3 = () => {
  // render
  renderer.render(scene, camera);
  requestAnimationFrame(tick3);
};

tick1();
// tick2();
// tick3();
