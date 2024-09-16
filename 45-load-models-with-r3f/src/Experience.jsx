import { Suspense } from "react";
import { OrbitControls, Clone, useGLTF } from "@react-three/drei";
import { Perf } from "r3f-perf";
// import { useLoader } from "@react-three/fiber";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

import { HamburgerModel } from "./HamburgerModel";
import { FoxModel } from "./FoxModel";

export default function Experience() {
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={4.5}
        shadow-normalBias={0.05}
      />
      <ambientLight intensity={1.5} />

      <Suspense
        fallback={<ModelPlaceholder position-y={0.5} scale={[2, 3, 2]} />}
      >
        {/* <Model /> */}
        <HamburgerModel scale={0.1} position={[3, 0, 3]} />
      </Suspense>

      <Suspense
        fallback={<ModelPlaceholder position-y={0.5} scale={[2, 3, 2]} />}
      >
        <FoxModel scale={0.02} position-y={-1} />
      </Suspense>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}

const ModelPlaceholder = ({ ...props }) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshBasicMaterial wireframe color="red" />
    </mesh>
  );
};

const Model = () => {
  //   const model = useLoader(
  //     GLTFLoader,
  //     // "./FlightHelmet/glTF/FlightHelmet.gltf"
  //     "./hamburger.glb"
  //     //  (loader) => {
  //     //     const draco = new DRACOLoader();
  //     //     // draco.setDecoderPath("./draco");

  //     //     loader.setDRACOLoader(draco);
  //     //  }
  //   );

  const model = useGLTF("./hamburger-draco.glb");

  // Clone reuses geometries and materials
  return (
    <>
      <Clone
        object={model.scene}
        scale={0.25}
        position-y={-1}
        position-x={-3}
      />
      <Clone object={model.scene} scale={0.25} position-y={-1} position-x={0} />
      <Clone object={model.scene} scale={0.25} position-y={-1} position-x={3} />
    </>
  );
};

// preload models in module scope!
useGLTF.preload("./hamburger-draco.glb");
