import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, meshBounds } from "@react-three/drei";
import { useRef } from "react";

export default function Experience() {
  const cube = useRef();
  const three = useThree();

  const hamburgerModel = useGLTF("./hamburger.glb");

  useFrame((state, delta) => {
    cube.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh
        position-x={-2}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
        }}
      >
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh
        ref={cube}
        position-x={2}
        scale={1.5}
        onClick={(e) => {
          e.object.material.color.setRGB(
            Math.random(),
            Math.random(),
            Math.random()
          );
        }}
        onPointerEnter={() => {
          three.gl.domElement.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          three.gl.domElement.style.cursor = "auto";
        }}
        // raycast agains bounding sphere of the mesh for better perf
        raycast={meshBounds}
      >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <primitive
        object={hamburgerModel.scene}
        scale={0.2}
        position-y={1}
        onClick={(e) => {
          console.log(e.object.name);
          e.stopPropagation();
        }}
      />

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
