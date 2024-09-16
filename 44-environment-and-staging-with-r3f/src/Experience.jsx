import * as THREE from "three";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  BakeShadows,
  SoftShadows,
  AccumulativeShadows,
  RandomizedLight,
  ContactShadows,
  Environment,
  Sky,
  useHelper,
  Lightformer,
  Stage,
} from "@react-three/drei";
import { useRef } from "react";
import { Perf } from "r3f-perf";

export default function Experience() {
  const directionalLightRef = useRef();
  const cubeRef = useRef();

  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta * 0.2;
    // cubeRef.current.position.x = Math.sin(2 * state.clock.elapsedTime) + 3;
  });

  //   useHelper(directionalLightRef, THREE.DirectionalLightHelper);

  const contactShadowControls = useControls("contact shadow", {
    color: "#000000",
    opacity: {
      value: 0.4,
      min: 0,
      max: 1,
      step: 0.01,
    },
    blur: {
      value: 1.8,
      min: 0,
      max: 10,
      step: 0.01,
    },
  });

  const skyControls = useControls("sky", {
    sunPosition: [1, 2, 3],
  });

  const envControls = useControls("env", {
    intensity: {
      value: 1,
      min: 0,
      max: 12,
      step: 0.01,
    },
    height: {
      value: 7,
      min: 0,
      max: 50,
      step: 0.1,
    },
    radius: {
      value: 29,
      min: 0,
      max: 500,
      step: 1,
    },
    scale: {
      value: 100,
      min: 0,
      max: 1000,
      step: 1,
    },
  });

  return (
    <>
      <OrbitControls makeDefault />
      <Stage
        shadows={{
          type: "contact",
          opacity: contactShadowControls.opacity,
        }}
      >
        <group position-y={1}>
          <mesh position-x={-2} castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
          <mesh ref={cubeRef} position-x={2} scale={1.5} castShadow>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </group>
      </Stage>
    </>
  );

  //   return (
  //     <>
  //       {/* render shadows only once */}
  //       {/* <BakeShadows /> */}

  //       {/* <SoftShadows size={25} samples={10} focus={0} /> */}

  //       <Perf position="top-left" />

  //       <OrbitControls makeDefault />

  //       {/* <directionalLight
  //         shadow-mapSize={[1024 * 2, 1024 * 2]}
  //         shadow-camera-top={4}
  //         shadow-camera-right={4}
  //         shadow-camera-bottom={-4}
  //         shadow-camera-left={-4}
  //         shadow-camera-near={1}
  //         shadow-camera-far={10}
  //         ref={directionalLightRef}
  //         position={skyControls.sunPosition}
  //         intensity={4.5}
  //         castShadow
  //       /> */}
  //       {/* <ambientLight intensity={1.5} /> */}
  //       <group position-y={1}>
  //         <mesh position-x={-2} castShadow>
  //           <sphereGeometry />
  //           <meshStandardMaterial color="orange" />
  //         </mesh>

  //         <mesh ref={cubeRef} position-x={2} scale={1.5} castShadow>
  //           <boxGeometry />
  //           <meshStandardMaterial color="mediumpurple" />
  //         </mesh>

  //         {/* <mesh
  //           position-y={-1}
  //           rotation-x={-Math.PI * 0.5}
  //           scale={15}
  //           // receiveShadow
  //         >
  //           <planeGeometry />
  //           <meshStandardMaterial color="greenyellow" />
  //         </mesh> */}
  //       </group>

  //       <ContactShadows
  //         position={[0, 0.1, 0]}
  //         scale={15}
  //         resolution={512}
  //         far={5}
  //         opacity={contactShadowControls.opacity}
  //         blur={contactShadowControls.blur}
  //         color={contactShadowControls.color}
  //       />

  //       {/* <AccumulativeShadows
  //         position={[0, -1 + 0.01, 0]}
  //         scale={15}
  //         color="#316d39"
  //         opacity={0.8}
  //         frames={Infinity}
  //         blend={120}
  //         temporal
  //       >
  //         <RandomizedLight
  //           amount={8}
  //           radius={1}
  //           ambient={0.5}
  //           intensity={3}
  //           position={[1, 2, 3]}
  //           bias={0.001}
  //         />
  //       </AccumulativeShadows> */}

  //       {/* <Sky sunPosition={skyControls.sunPosition} /> */}

  //       <Environment
  //         // background
  //         ground={{
  //           height: envControls.height,
  //           radius: envControls.radius,
  //           scale: envControls.scale,
  //         }}
  //         // files={[
  //         //   "./environmentMaps/1/px.jpg",
  //         //   "./environmentMaps/1/nx.jpg",
  //         //   "./environmentMaps/1/py.jpg",
  //         //   "./environmentMaps/1/ny.jpg",
  //         //   "./environmentMaps/1/pz.jpg",
  //         //   "./environmentMaps/1/nz.jpg",
  //         // ]}
  //         // files={"./environmentMaps/the_sky_is_on_fire_2k.hdr"}
  //         preset="sunset"
  //         environmentIntensity={envControls.intensity}
  //       >
  //         {/* <color args={["black"]} attach={"background"} /> */}
  //         {/* <mesh position-z={-5} scale={10}>
  //           <planeGeometry />
  //           <meshStandardMaterial color={[10, 0, 0]} />
  //         </mesh> */}
  //         {/* <Lightformer
  //           position-z={-5}
  //           scale={10}
  //           color="red"
  //           intensity={5}
  //           form="ring"
  //         />

  //         <Lightformer
  //           position-z={5}
  //           position-y={10}
  //           scale={3}
  //           color="green"
  //           intensity={20}
  //           form="ring"
  //         /> */}
  //       </Environment>
  //     </>
  //   );
}
