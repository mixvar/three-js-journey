import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureLoader = new THREE.TextureLoader();

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 2.5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Textures
 */

const shaderNormalTexture = textureLoader.load(
  "/textures/interfaceNormalMap.png"
);

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Models
 */
gltfLoader.load("/models/DamagedHelmet/glTF/DamagedHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(2, 2, 2);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  updateAllMaterials();
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(0.25, 3, -2.25);
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

  // Update effect composer
  effectComposer.setSize(sizes.width, sizes.height);
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
camera.position.set(4, 1, -4);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.outputColorSpace = THREE.SRGBColorSpace; // now default
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// TODO
/**
 * Post processing
 */

// we need to provide custom render target to make antialiasing work
// we can use any width/height as we update these on resize anyway
const renderTarget = new THREE.RenderTarget(800, 600, {
  // higher value => better anti-alias & worse performance
  // not needed if we already render with high pixel-ratio
  // only works on WebGL 2.0 - see https://caniuse.com/webgl2
  // on unsupported devices it will not have any negative side-effects
  // uses MSAA antialias strategy
  samples: renderer.getPixelRatio() > 1 ? 0 : 2,
});

const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setSize(sizes.width, sizes.height);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

// -- EFFECT PASSES ---

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
effectComposer.addPass(dotScreenPass);

const glitchPass = new GlitchPass();
// glitchPass.goWild = true;
glitchPass.enabled = false;
effectComposer.addPass(glitchPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.enabled = false;
effectComposer.addPass(rgbShiftPass);

const unrealBloomPass = new UnrealBloomPass();
// unrealBloomPass.enabled = false;
unrealBloomPass.strength = 0.2;
unrealBloomPass.radius = 1;
// unrealBloomPass.threshold = 0.5;

// gui.add(unrealBloomPass, "enabled");
// gui.add(unrealBloomPass, "strength").min(0).max(2).step(0.01);
// gui.add(unrealBloomPass, "radius").min(0).max(2).step(0.01);
// gui.add(unrealBloomPass, "threshold").min(0).max(2).step(0.01);

// unrealBloomPass.enabled = false;
effectComposer.addPass(unrealBloomPass);

// -- CUSTOM PASSES ---

// TINT PASS

const TintShader = {
  uniforms: {
    // texture (render target) from previous pass
    // effect composer will inject the value
    tDiffuse: { value: null },

    uTint: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vUv = uv;
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec3 uTint;

    varying vec2 vUv;

    void main() {
        vec4 texel = texture2D(tDiffuse, vUv);
        
        gl_FragColor = texel;

        gl_FragColor.rgb += uTint;
    }
  `,
};
const customTintPass = new ShaderPass(TintShader);
customTintPass.material.uniforms.uTint.value = new THREE.Vector3(0, 0, 0);

gui
  .add(customTintPass.material.uniforms.uTint.value, "x")
  .min(-0.25)
  .max(0.25)
  .step(0.001)
  .name("red");
gui
  .add(customTintPass.material.uniforms.uTint.value, "y")
  .min(-0.25)
  .max(0.25)
  .step(0.001)
  .name("green");
gui
  .add(customTintPass.material.uniforms.uTint.value, "z")
  .min(-0.25)
  .max(0.25)
  .step(0.001)
  .name("blue");

effectComposer.addPass(customTintPass);

// DISPLACEMENT PASS

const DisplacementShader = {
  uniforms: {
    // texture (render target) from previous pass
    // effect composer will inject the value
    tDiffuse: { value: null },
    uTime: { value: null },
  },
  vertexShader: `
      varying vec2 vUv;
  
      void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vUv = uv;
      }
    `,
  fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float uTime;
  
      varying vec2 vUv;
  
      void main() {
          vec2 alteredUv = vUv;

          alteredUv.y += sin(vUv.x * 10.0 + uTime) * 0.1;

          vec4 texel = texture2D(tDiffuse, alteredUv);
          
          gl_FragColor = texel;
      }
    `,
};
const customDisplacementPass = new ShaderPass(DisplacementShader);
customDisplacementPass.material.uniforms.uTime.value = 0;
customDisplacementPass.enabled = false;
effectComposer.addPass(customDisplacementPass);

// futuristic displacement

const FuturisticDisplacementShader = {
  uniforms: {
    // texture (render target) from previous pass
    // effect composer will inject the value
    tDiffuse: { value: null },
    uNormalMap: { value: null },
  },
  vertexShader: `
        varying vec2 vUv;
    
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vUv = uv;
        }
      `,
  fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;
        uniform float uTime;
    
        varying vec2 vUv;
    
        void main() {
            vec3 normalOffset = (texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0);
            
            vec2 alteredUv = vUv + normalOffset.xy * 0.1;

            vec4 texel = texture2D(tDiffuse, alteredUv);

            vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalOffset, lightDirection), 0.0, 1.0);
            texel.rgb += lightness * 0.2;
            
            gl_FragColor = texel;
        }
      `,
};
const customFuturisticDisplacementPass = new ShaderPass(
  FuturisticDisplacementShader
);
customFuturisticDisplacementPass.enabled = false;
customFuturisticDisplacementPass.material.uniforms.uNormalMap.value =
  shaderNormalTexture;

//   customFuturisticDisplacementPass.enabled = false;
effectComposer.addPass(customFuturisticDisplacementPass);

// -- MISC PASSES ---

// goes after all regular passes
const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);

if (renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2) {
  // goes after all other passes
  // worse for perf than custom RenderTarget with samples property
  // and provides worse result than MSAA
  // but works on all devices
  const antialiasPass = new SMAAPass();
  effectComposer.addPass(antialiasPass);
}

/**
 * Animate
 */
const clock1 = new THREE.Clock();
const clock2 = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock1.getElapsedTime();
  const deltaTime = clock2.getDelta();

  // update shaders
  customDisplacementPass.material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  //   renderer.render(scene, camera);
  effectComposer.render();

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
