import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";

THREE.ColorManagement.enabled = false;

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  pointsmaterial.color.set(parameters.materialColor);
});

/**
 * Textures
 */

const textureLoader = new THREE.TextureLoader();

const gradientTexture = textureLoader.load("textures/gradients/3.jpg");

// without this the toon effect does not work and we get full gradient
gradientTexture.magFilter = THREE.NearestFilter;

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

const objDistance = 4;
const objOffset = 1.5;

mesh1.position.y = objDistance * 0;
mesh2.position.y = objDistance * -1;
mesh3.position.y = objDistance * -2;

mesh1.position.x = objOffset;
mesh2.position.x = -objOffset;
mesh3.position.x = objOffset;

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

sectionMeshes.forEach((mesh) => {
  mesh.scale.multiplyScalar(0.5);
});

/**
 * Particles
 */

const particleCount = 1000;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 3) {
  const x = (Math.random() - 0.5) * 10;
  const y =
    objDistance * 0.5 - Math.random() * objDistance * sectionMeshes.length;
  const z = (Math.random() - 0.5) * 10;

  positions[i] = x;
  positions[i + 1] = y;
  positions[i + 2] = z;
}

const pointsGeometry = new THREE.BufferGeometry();
pointsGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

const pointsmaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  size: 0.03,
  sizeAttenuation: true,
});

const points = new THREE.Points(pointsGeometry, pointsmaterial);
scene.add(points);

/**
 * Light
 */

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
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
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;

const cameraGroup = new THREE.Group();

cameraGroup.add(camera);
scene.add(cameraGroup);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */

const rotateSectionObject = (sectionIndex) => {
  gsap.to(sectionMeshes[sectionIndex].rotation, {
    duration: 1.5,
    ease: "power2.inOut",
    x: "+=6",
    y: "+=3",
    z: "+=1.5",
  });
};

let scroll = window.scrollY / sizes.height;
let currentSection = 0;
window.addEventListener(
  "scroll",
  () => {
    scroll = window.scrollY / sizes.height;

    const newCurrentSection = Math.round(scroll);
    if (currentSection !== newCurrentSection) {
      currentSection = newCurrentSection;
      rotateSectionObject(currentSection);
    }
  },
  { passive: true }
);

/**
 * Cursor
 */

const cursor = { x: 0, y: 0 };
window.addEventListener(
  "mousemove",
  (e) => {
    cursor.x = e.clientX / sizes.width - 0.5;
    cursor.y = e.clientY / sizes.height - 0.5;
  },
  { passive: true }
);

/**
 * Animate
 */
const clock1 = new THREE.Clock();
const clock2 = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock1.getElapsedTime();
  const delteTime = clock2.getDelta();

  // animate camera
  const parallaxX = cursor.x * 0.1;
  const parallaxY = cursor.y * -0.1;
  const scrollOffset = scroll * -1 * objDistance;

  camera.position.y = scrollOffset;

  // parallax with smoothing
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * delteTime * 5;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * delteTime * 5;

  // animated objects
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += delteTime * 0.1;
    mesh.rotation.y += delteTime * 0.15;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
