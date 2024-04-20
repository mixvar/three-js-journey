import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as Three from "three";
import { CustomObject } from "./custom-object";

export const Experience = () => {
  const three = useThree();
  const groupRef = useRef<Three.Group>(null);
  const cubeRef = useRef<Three.Mesh>(null);

  useFrame((_state, delta) => {
    groupRef.current?.rotateY(delta * 0.6);
    cubeRef.current?.rotateY(delta);

    // {
    //   const { camera, clock } = state;
    //   camera.position.x = Math.sin(clock.elapsedTime * 0.2) * 10;
    //   camera.position.z = Math.cos(clock.elapsedTime * 0.2) * 10;
    //   three.camera.lookAt(0, 0, 0);
    // }
  });

  return (
    <>
      <orbitControls args={[three.camera, three.gl.domElement]} />
      <directionalLight position={[1, 2, 3]} intensity={4} />
      <ambientLight intensity={1.2} />

      <group ref={groupRef}>
        <mesh ref={cubeRef} position={[1.5, -1.5, 1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh scale={1} position={[-2, -1, 1]}>
          <sphereGeometry />
          <meshStandardMaterial color="darkorange" />
        </mesh>
      </group>

      <mesh scale={10} position={[0, -2, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry />
        <meshStandardMaterial
          color="greenyellow"
          side={Three.DoubleSide}
          roughness={0.75}
        />
      </mesh>

      <CustomObject />
    </>
  );
};
