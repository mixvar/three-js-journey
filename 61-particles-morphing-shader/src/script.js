import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import gsap from "gsap";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

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
  if (particles) {
    particles.material.uniforms.uResolution.value.set(
      sizes.width * sizes.pixelRatio,
      sizes.height * sizes.pixelRatio
    );
  }

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
camera.position.set(0, 0, 8 * 2);
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

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

debugObject.clearColor = "#160920";
gui.addColor(debugObject, "clearColor").onChange(() => {
  renderer.setClearColor(debugObject.clearColor);
});
renderer.setClearColor(debugObject.clearColor);

/**
 * Particles
 */
let particles = null;

// Models
gltfLoader.load("./models.glb", (gltf) => {
  particles = {};

  // Positions
  const positions = gltf.scene.children.map(
    (child) => child.geometry.attributes.position
  );

  particles.maxCount = positions.reduce(
    (acc, pos) => (pos.count > acc ? pos.count : acc),
    0
  );

  // create normalized positions
  particles.positions = positions.map((pos) => {
    const originalArray = pos.array;
    const newArray = new Float32Array(particles.maxCount * 3);

    for (let i = 0; i < particles.maxCount; i++) {
      const i3 = i * 3;
      if (i3 < originalArray.length) {
        newArray[i3] = originalArray[i3];
        newArray[i3 + 1] = originalArray[i3 + 1];
        newArray[i3 + 2] = originalArray[i3 + 2];
      } else {
        // we place excess vertices in the same place as some existing random vertex
        const randomVertex = Math.floor(Math.random() * pos.count);
        newArray[i3 + 0] = originalArray[randomVertex * 3 + 0];
        newArray[i3 + 1] = originalArray[randomVertex * 3 + 1];
        newArray[i3 + 2] = originalArray[randomVertex * 3 + 2];
      }
    }

    return new THREE.Float32BufferAttribute(newArray, 3);
  });

  particles.index = 0;

  // Geometry

  particles.geometry = new THREE.BufferGeometry();
  particles.geometry.setAttribute(
    "position",
    particles.positions[particles.index]
  );
  particles.geometry.setAttribute("aPositionTarget", particles.positions[3]);
  // particles.geometry.setIndex(null); // not needed when using a smoothed geometry from Blender

  // random sizes
  const sizesArray = new Float32Array(particles.maxCount);
  for (let i = 0; i < particles.maxCount; i++) {
    sizesArray[i] = Math.random();
  }
  particles.geometry.setAttribute(
    "aSize",
    new THREE.BufferAttribute(sizesArray, 1)
  );

  // Material

  particles.colors = {
    color1: new THREE.Color("#aeff00"),
    color2: new THREE.Color("#13cbd8"),
  };

  particles.material = new THREE.ShaderMaterial({
    vertexShader: particlesVertexShader,
    fragmentShader: particlesFragmentShader,
    uniforms: {
      uSize: new THREE.Uniform(0.4),
      uResolution: new THREE.Uniform(
        new THREE.Vector2(
          sizes.width * sizes.pixelRatio,
          sizes.height * sizes.pixelRatio
        )
      ),
      uProgress: new THREE.Uniform(0),
      uColor1: new THREE.Uniform(particles.colors.color1),
      uColor2: new THREE.Uniform(particles.colors.color2),
    },
    depthWrite: false,
    blending: THREE.AdditiveBlending, // we don't even need to enable transparency when using this blend mode
  });

  // Points
  particles.points = new THREE.Points(particles.geometry, particles.material);
  particles.points.frustumCulled = false; // boundingSphere is based on position attribute so it is inaccurate for our setup. IF the points is the main object of the scene we can just disable the culling, so it's always visible
  scene.add(particles.points);

  particles.isMorphing = false;

  particles.morph = (targetIndex) => {
    if (particles.isMorphing) {
      return;
    }

    if (particles.index === targetIndex) {
      return;
    }

    particles.isMorphing = true;

    // update attributes
    particles.geometry.attributes.position =
      particles.positions[particles.index];

    particles.geometry.attributes.aPositionTarget =
      particles.positions[targetIndex];

    // animated progress

    gsap
      .fromTo(
        particles.material.uniforms.uProgress,
        { value: 0 },
        { value: 1, duration: 3, ease: "linear" }
      )
      .then(() => {
        particles.isMorphing = false;
      });

    particles.index = targetIndex;
  };

  // tweaks
  gui.addColor(particles.colors, "color1").onChange((value) => {
    particles.material.uniforms.uColor1.value.set(value);
  });
  gui.addColor(particles.colors, "color2").onChange((value) => {
    particles.material.uniforms.uColor2.value.set(value);
  });

  gui
    .add(particles.material.uniforms.uProgress, "value")
    .min(0)
    .max(1)
    .step(0.001)
    .name("progress")
    .listen();

  gltf.scene.children.forEach((it, i) => {
    gui
      .add(
        {
          morph: () => {
            particles.morph(i);
          },
        },
        "morph"
      )
      .name(`morph into ${it.name}`);
  });
});

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render normal scene
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
