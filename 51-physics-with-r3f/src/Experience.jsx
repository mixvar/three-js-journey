import * as Three from "three";
import { useRef, useMemo, useEffect } from "react";
import { OrbitControls, useGLTF, Instances, Instance } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useFrame } from "@react-three/fiber";
import {
  CylinderCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  InstancedRigidBodies,
} from "@react-three/rapier";

const CUBES_COUNT = 1_000;

export default function Experience() {
  const sphereRef = useRef();
  const twisterRef = useRef();
  const cubesRef = useRef();

  const hitSound = useMemo(() => new Audio("./hit.mp3"), []);

  const hamburgerModel = useGLTF("/hamburger.glb");

  const cubeInstances = useMemo(
    () =>
      [...Array(CUBES_COUNT)].map((_, i) => ({
        key: i,
        position: [
          Math.random() * 20 - 10,
          Math.random() * 10 + 3,
          Math.random() * 20 - 10,
        ],
        rotation: [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
        ],
        scale: Math.random() * 0.5 + 0.5,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!twisterRef.current) return;

    const t = clock.getElapsedTime();

    const euler = new Three.Euler(0, t * 3, 0);
    const qt = new Three.Quaternion().setFromEuler(euler);
    twisterRef.current.setNextKinematicRotation(qt);

    const angle = t;
    const x = Math.cos(angle) * 4;
    const z = Math.sin(angle) * 4;
    twisterRef.current.setNextKinematicTranslation({ x, y: -0.5, z });
  });

  // useEffect(() => {
  //   for (let i = 0; i < CUBES_COUNT; i++) {
  //     const matrix = new Three.Matrix4().compose(
  //       new Three.Vector3(
  //         Math.random() * 20 - 10,
  //         Math.random() * 10 + 3,
  //         Math.random() * 20 - 10
  //       ),
  //       new Three.Quaternion().setFromEuler(
  //         new Three.Euler(
  //           Math.random() * Math.PI * 2,
  //           Math.random() * Math.PI * 2,
  //           Math.random() * Math.PI * 2
  //         )
  //       ),
  //       new Three.Vector3(1, 1, 1).multiplyScalar(Math.random() * 0.5 + 0.5)
  //     );
  //     cubesRef.current.setMatrixAt(i, matrix);
  //   }
  // }, []);

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <Physics>
        {/* <instancedMesh
          castShadow
          args={[null, null, CUBES_COUNT]}
          ref={cubesRef}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="tomato" />
        </instancedMesh> */}

        {/* <Instances limit={CUBES_COUNT} castShadow receiveShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="tomato" />
          {[...Array(CUBES_COUNT)].map((_, i) => (
            <Instance
              key={i}
              scale={Math.random() * 0.5 + 0.5}
              position={[
                Math.random() * 20 - 10,
                Math.random() * 10 + 3,
                Math.random() * 20 - 10,
              ]}
              rotation={[
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
              ]}
            />
          ))}
        </Instances> */}

        <InstancedRigidBodies instances={cubeInstances}>
          <instancedMesh castShadow args={[null, null, CUBES_COUNT]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="tomato" />
          </instancedMesh>
        </InstancedRigidBodies>

        <RigidBody
          mass={4}
          colliders="ball"
          ref={sphereRef}
          restitution={0.1}
          onCollisionEnter={() => {
            // hitSound.currentTime = 0;
            // hitSound.volume = Math.random();
            // hitSound.play();
          }}
        >
          <mesh
            castShadow
            position-y={4}
            scale={1}
            onClick={() => {
              sphereRef.current.applyImpulse({
                x: Math.random() * 3,
                y: 10,
                z: Math.random() * 3,
              });
            }}
          >
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody colliders="trimesh" restitution={0.1}>
          <mesh castShadow position-y={2} rotation-x={Math.PI / 2}>
            <torusGeometry args={[1, 0.3, 16, 100]} />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        <RigidBody
          colliders={false}
          restitution={0.5}
          friction={0.2}
          position-y={3}
          position-x={-3}
        >
          <CylinderCollider args={[0.5, 1]} />
          <primitive object={hamburgerModel.scene} scale={0.2} />
        </RigidBody>

        <RigidBody
          type="kinematicPosition"
          ref={twisterRef}
          friction={0}
          position={[2, 0, 2]}
        >
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.5, 4]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" restitution={0.1} friction={0.4}>
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[22, 0.5, 22]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed" restitution={1}>
          <CuboidCollider args={[10, 2, 0.5]} position={[0, 1, 10.5]} />
          <CuboidCollider args={[10, 2, 0.5]} position={[0, 1, -10.5]} />
          <CuboidCollider args={[0.5, 2, 10]} position={[10.5, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 10]} position={[-10.5, 1, 0]} />
        </RigidBody>
      </Physics>
    </>
  );
}
