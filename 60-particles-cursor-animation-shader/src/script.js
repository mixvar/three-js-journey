import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

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
  particlesMaterial.uniforms.uResolution.value.set(
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
camera.position.set(0, 0, 18);
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
renderer.setClearColor("#181818");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

/**
 * displacement
 */

const displacement = {};

// 2D canvas
displacement.canvas = document.createElement("canvas");
displacement.canvas.width = 128;
displacement.canvas.height = 128;

displacement.canvas.style.position = "fixed";
displacement.canvas.style.width = "256px";
displacement.canvas.style.height = "256px";
displacement.canvas.style.top = "0";
displacement.canvas.style.left = "0";
displacement.canvas.style.zIndex = 10;

// document.body.append(displacement.canvas);

// context
displacement.context = displacement.canvas.getContext("2d");
displacement.context.fillRect(
  0,
  0,
  displacement.canvas.width,
  displacement.canvas.height
);

// glow image
displacement.glowImage = new Image();
displacement.glowImage.src = "./glow.png";

// raycasting
displacement.interactivePlane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
);
displacement.interactivePlane.visible = false;
scene.add(displacement.interactivePlane);

displacement.raycaster = new THREE.Raycaster();

// normalized screen coordinates a.k.a clip space
displacement.screenCursor = new THREE.Vector2(9999, 9999);
window.addEventListener("pointermove", (e) => {
  displacement.screenCursor.x = (event.clientX / sizes.width) * 2 - 1;
  displacement.screenCursor.y = -(event.clientY / sizes.height) * 2 + 1;
  //   console.log(displacement.screenCursor);
});

displacement.canvasCursor = new THREE.Vector2(9999, 9999);
displacement.canvasCursorPrv = new THREE.Vector2(9999, 9999);

displacement.texture = new THREE.CanvasTexture(displacement.canvas);

/**
 * Particles
 */
const GRID_SIZE = 128;
const particlesGeometry = new THREE.PlaneGeometry(10, 10, GRID_SIZE, GRID_SIZE);
particlesGeometry.setIndex(null); // we need to remove index when using Points to avoid drawing multiple particles on top of each other
particlesGeometry.deleteAttribute("normal");
const particlesCount = particlesGeometry.attributes.position.count;

// random intensity
const intensityFactorArr = new Float32Array(particlesCount);
for (let i = 0; i < intensityFactorArr.length; i++) {
  intensityFactorArr[i] = Math.random();
}
particlesGeometry.setAttribute(
  "aIntensity",
  new THREE.BufferAttribute(intensityFactorArr, 1)
);

// random angle factor
const angleArr = new Float32Array(particlesCount);
for (let i = 0; i < angleArr.length; i++) {
  angleArr[i] = Math.random() * Math.PI * 2; // sort of spherical coords?
}
particlesGeometry.setAttribute(
  "aAngle",
  new THREE.BufferAttribute(angleArr, 1)
);

const particlesMaterial = new THREE.ShaderMaterial({
  vertexShader: particlesVertexShader,
  fragmentShader: particlesFragmentShader,
  uniforms: {
    uResolution: new THREE.Uniform(
      new THREE.Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    ),
    uPictureTexture: new THREE.Uniform(textureLoader.load("./frieren-1.png")),
    // uPictureTexture: new THREE.Uniform(textureLoader.load("./picture-4.png")),
    uDisplacementTexture: new THREE.Uniform(displacement.texture),
  },
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // raycasting
  displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
  const intersections = displacement.raycaster.intersectObject(
    displacement.interactivePlane
  );

  if (intersections.length) {
    const uv = intersections[0].uv;

    displacement.canvasCursor.x = uv.x * displacement.canvas.width;
    displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height;

    // console.log(displacement.canvasCursor);
  } else {
    displacement.canvasCursor.x - 999;
    displacement.canvasCursor.y = 999;
  }

  // fade out
  displacement.context.globalCompositeOperation = "source-over"; // reset color blending to default
  displacement.context.globalAlpha = 0.02;
  displacement.context.fillRect(
    0,
    0,
    displacement.canvas.width,
    displacement.canvas.height
  );

  // speed alpha
  const cursorDelta = displacement.canvasCursor.distanceTo(
    displacement.canvasCursorPrv
  );
  displacement.canvasCursorPrv.copy(displacement.canvasCursor);
  const alpha = Math.min(1, cursorDelta * 0.1);

  // draw glow
  const brushSize = displacement.canvas.width * 0.25;
  displacement.context.globalAlpha = alpha;
  displacement.context.globalCompositeOperation = "lighten"; // additive color blending
  displacement.context.drawImage(
    displacement.glowImage,
    displacement.canvasCursor.x - brushSize / 2,
    displacement.canvasCursor.y - brushSize / 2,
    brushSize,
    brushSize
  );

  // update canvas texture
  displacement.texture.needsUpdate = true;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
