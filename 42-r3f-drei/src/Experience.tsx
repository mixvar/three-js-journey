import Three from "three";

import {
  OrbitControls,
  TransformControls,
  PivotControls,
  Html,
  Text,
  Float,
  MeshReflectorMaterial,
} from "@react-three/drei";
import { useRef } from "react";

export const Experience = () => {
  const sphereRef = useRef<Three.Mesh>(null);
  const boxRef = useRef<Three.Mesh>(null);

  return (
    <>
      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />
      <OrbitControls makeDefault />

      <PivotControls anchor={[0, 0, 0]} depthTest={false}>
        <mesh ref={sphereRef} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
          <Html
            position={[0.7, 0.7, 0.7]}
            center
            distanceFactor={8}
            occlude={[sphereRef, boxRef]}
          >
            <div className="label-3d">My Sphere ✨</div>
          </Html>
        </mesh>
      </PivotControls>

      <mesh ref={boxRef} position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <TransformControls object={boxRef as any} mode="translate" />

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />

        <MeshReflectorMaterial
          roughness={0.5}
          mirror={0}
          resolution={1024}
          blur={1}
          mixBlur={1}
          color="greenyellow"
        />
      </mesh>

      <Float speed={2}>
        <Text
          position-y={1.5}
          fontSize={0.6}
          font="./bangers-v20-latin-regular.woff"
        >
          I LOVE R3F
          <meshNormalMaterial />
        </Text>
      </Float>
    </>
  );
};
