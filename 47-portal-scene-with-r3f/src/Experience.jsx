import * as THREE from "three";
import {
  OrbitControls,
  Center,
  Sparkles,
  useGLTF,
  useTexture,
  shaderMaterial,
} from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import portalVertexShader from "./shaders/portal/vertex.glsl";
import portalFragmentShader from "./shaders/portal/fragment.glsl";

// there is some issue with loading custom shaders with this helper :(
// see: https://codesandbox.io/p/sandbox/ni6v4?file=%2Fsrc%2FApp.js%3A16%2C22

// const PortalMaterial = shaderMaterial(
//   {
//     uTime: 0,
//     uColorInner: new THREE.Color(0x040208),
//     uColorOuter: new THREE.Color(0xfcfaff),
//   },
//   portalFragmentShader,
//   portalVertexShader
// );

// console.log(PortalMaterial);

// extend({ PortalMaterial });

export default function Experience() {
  const model = useGLTF("./model/portal.glb");

  const bakedTexture = useTexture("./model/baked.jpg");
  bakedTexture.flipY = false;

  const uniformsRef = useRef({
    uTime: { value: 0 },
    uColorInner: { value: new THREE.Color(0x040208) },
    uColorOuter: { value: new THREE.Color(0xfcfaff) },
  });

  useFrame((_, delta) => {
    uniformsRef.current.uTime.value += delta;
  });

  return (
    <>
      <color args={["#030202"]} attach="background" />

      <OrbitControls makeDefault />

      <Center>
        {/* scene with baked texture */}
        <mesh
          geometry={model.nodes.merged.geometry}
          position={model.nodes.merged.position}
          rotation={model.nodes.merged.rotation}
          scale={model.nodes.merged.scale}
        >
          <meshBasicMaterial map={bakedTexture} />
        </mesh>

        {/* pole lights */}
        <mesh
          geometry={model.nodes.POLE_LIGHT_A.geometry}
          position={model.nodes.POLE_LIGHT_A.position}
          rotation={model.nodes.POLE_LIGHT_A.rotation}
          scale={model.nodes.POLE_LIGHT_A.scale}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>
        <mesh
          geometry={model.nodes.POLE_LIGHT_B.geometry}
          position={model.nodes.POLE_LIGHT_B.position}
          rotation={model.nodes.POLE_LIGHT_B.rotation}
          scale={model.nodes.POLE_LIGHT_B.scale}
        >
          <meshBasicMaterial color="#ffffe5" />
        </mesh>

        {/* portal surface */}
        <mesh
          geometry={model.nodes.PORTAL_SURFACE.geometry}
          position={model.nodes.PORTAL_SURFACE.position}
          rotation={model.nodes.PORTAL_SURFACE.rotation}
          scale={model.nodes.PORTAL_SURFACE.scale}
        >
          <shaderMaterial
            uniforms={uniformsRef.current}
            vertexShader={portalVertexShader}
            fragmentShader={portalFragmentShader}
          />
        </mesh>

        {/* fireflies effect */}
        <Sparkles
          size={5}
          scale={[4, 2, 4]}
          position={[0, 1.2, 0]}
          speed={0.2}
          count={50}
        />
      </Center>
    </>
  );
}
