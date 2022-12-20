// scene
const scene = new THREE.Scene();

// red cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// sizes
const sizes = { width: 800, height: 600 };

// camera
const camera = (() => {
  const fieldOfView = 75;
  const aspectRatio = sizes.width / sizes.height;
  return new THREE.PerspectiveCamera(fieldOfView, aspectRatio);
})();
camera.position.z = 3;
camera.position.x = -1;
scene.add(camera);

// renderer
const canvas = document.getElementById("webgl");
const renderer = new THREE.WebGLRenderer({
  canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
