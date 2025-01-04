import * as Three from "three";
import { useRef, useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";
import { boxGeometry } from "./geometries";
import {
  floor1Material,
  floor2Material,
  floor3Material,
  obstacleMaterial,
  wallMaterial,
} from "./materials";
import { useGameStore } from "./game-store";

const BLOCK_SIZE_X = 4;
const BLOCK_SIZE_Z = 5;

const SPEED_BOOST_PER_LEVEL = 0.2;

export const Level = ({ trapCount = 5, trapBlocks = [] }) => {
  const chosenTraps = useMemo(
    () =>
      [...Array(trapCount)].map(
        () => trapBlocks[Math.floor(Math.random() * trapBlocks.length)]
      ),
    [trapCount]
  );

  return (
    <>
      <StartBlock key="start" position={[0, 0, 0]} />

      {chosenTraps.map((Trap, i) => (
        <Trap key={i} position={[0, 0, (i + 1) * BLOCK_SIZE_Z * -1]} />
      ))}

      <FinishBlock position={[0, 0, (trapCount + 1) * BLOCK_SIZE_Z * -1]} />
    </>
  );
};

const StartBlock = ({ position = [0, 0, 0] }) => {
  const level = useGameStore((store) => store.level);

  return (
    <group position={position}>
      <RigidBody type="fixed" friction={1} restitution={0.2}>
        <mesh
          receiveShadow
          position-y={-0.1}
          geometry={boxGeometry}
          material={floor1Material}
          scale={[BLOCK_SIZE_X, 0.2, BLOCK_SIZE_Z]}
        />
      </RigidBody>

      <Float floatIntensity={0.5} rotationIntensity={0.5}>
        <Text
          scale={0.5}
          position={[0.75, 0.65, 0]}
          rotation-y={-0.6}
          font="bebas-neue-v9-latin-regular.woff"
        >
          Level {level}
          <meshBasicMaterial toneMapped={false} opacity={0.75} />
        </Text>
      </Float>
    </group>
  );
};

const FinishBlock = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <RigidBody type="fixed" friction={1} restitution={0.2}>
        <mesh
          receiveShadow
          position-y={-0.1}
          geometry={boxGeometry}
          material={floor3Material}
          scale={[BLOCK_SIZE_X, 0.2, BLOCK_SIZE_Z]}
        />
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders="hull" // cylinder collider would be better
        position={[0, 1, 0]}
        restitution={5}
        friction={0}
        name="finish"
      >
        <mesh receiveShadow castShadow material={wallMaterial}>
          <cylinderGeometry args={[0.2, 0.2, 2]} />
        </mesh>
      </RigidBody>

      <Float floatIntensity={0.5} rotationIntensity={0.5}>
        <Text
          scale={0.75}
          position={[0, 1, 1]}
          font="bebas-neue-v9-latin-regular.woff"
        >
          Finish
          <meshBasicMaterial toneMapped={false} opacity={0.6} />
        </Text>
      </Float>
    </group>
  );
};

export const SpinnerTrapBlock = ({ position = [0, 0, 0] }) => {
  const obstacleRef = useRef();
  const level = useGameStore((store) => store.level);
  const rotationSpeed = useMemo(
    () =>
      (Math.random() * 0.5 + 1 + SPEED_BOOST_PER_LEVEL * level) *
      (Math.random() > 0.5 ? 1 : -1)
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    const rotation = new Three.Quaternion();
    rotation.setFromEuler(new Three.Euler(0, t * rotationSpeed, 0));
    obstacleRef.current?.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      <RigidBody type="fixed" friction={1} restitution={0.2}>
        <mesh
          receiveShadow
          position-y={-0.1}
          geometry={boxGeometry}
          material={floor2Material}
          scale={[BLOCK_SIZE_X, 0.2, BLOCK_SIZE_Z]}
        />
      </RigidBody>

      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.5, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          receiveShadow
          castShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
};

export const LimboTrapBlock = ({ position = [0, 0, 0] }) => {
  const obstacleRef = useRef();
  const level = useGameStore((store) => store.level);
  const offset = useMemo(() => Math.random() * Math.PI + 2);
  const speed = useMemo(
    () => Math.random() * 0.5 + 1 + SPEED_BOOST_PER_LEVEL * level
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const translation = Math.sin(t * speed + offset) + 1.2;

    obstacleRef.current?.setNextKinematicTranslation({
      x: position[0],
      y: translation,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <RigidBody type="fixed" friction={1} restitution={0.2}>
        <mesh
          receiveShadow
          position-y={-0.1}
          geometry={boxGeometry}
          material={floor2Material}
          scale={[BLOCK_SIZE_X, 0.2, BLOCK_SIZE_Z]}
        />
      </RigidBody>

      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        restitution={5}
        friction={0}
      >
        <mesh
          receiveShadow
          castShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.1]}
        />
      </RigidBody>
    </group>
  );
};

export const AxeTrapBlock = ({ position = [0, 0, 0] }) => {
  const obstacleRef = useRef();
  const level = useGameStore((store) => store.level);
  const offset = useMemo(() => Math.random() * Math.PI + 2);
  const speed = useMemo(
    () => Math.random() * 0.5 + 1 + SPEED_BOOST_PER_LEVEL * level
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const translation = Math.sin(t * speed + offset) * 3;

    obstacleRef.current?.setNextKinematicTranslation({
      x: position[0] + translation,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <RigidBody type="fixed" friction={1} restitution={0.2}>
        <mesh
          receiveShadow
          position-y={-0.1}
          geometry={boxGeometry}
          material={floor2Material}
          scale={[BLOCK_SIZE_X, 0.2, BLOCK_SIZE_Z]}
        />
      </RigidBody>

      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        restitution={2}
        friction={0}
      >
        <mesh
          receiveShadow
          castShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1, 0.1]}
        />
      </RigidBody>
    </group>
  );
};
