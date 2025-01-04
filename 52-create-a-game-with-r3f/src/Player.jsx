import * as Three from "three";
import { useRef, useEffect, useMemo } from "react";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "./game-store";

const JUMP_STRENGTH = 0.5;
const PUSH_STRENGTH = 0.6;
const ROTATE_STRENGTH = 0.2;

export const Player = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const marbleRef = useRef();

  const smoothCameraPos = useMemo(() => new Three.Vector3(0, 100, 100), []);
  const smoothCameraTarget = useMemo(() => new Three.Vector3(), []);

  const startGame = useGameStore((store) => store.start);
  const finishLevel = useGameStore((store) => store.finishLevel);
  const gameOver = useGameStore((store) => store.gameOver);

  useEffect(() => {
    const unsubscribeJumpListener = subscribeKeys(
      (keys) => keys.jump,
      (jump) => {
        if (jump) {
          const origin = marbleRef.current.translation();
          origin.y -= 0.31; // put it slightly below the sphere
          const direction = { x: 0, y: -1, z: 0 };
          const ray = new rapier.Ray(origin, direction);
          const hit = world.castRay(ray, 10, true); // we need that 'true' to treat objects as solids

          // timeOfImpact is like distance
          const marbleIsInTheAir = !hit || hit.timeOfImpact > 0.15;

          if (!marbleIsInTheAir) {
            marbleRef.current?.applyImpulse({ x: 0, y: JUMP_STRENGTH, z: 0 });
          }
        }
      }
    );

    const unsubscribeAnyActionKeyListener = subscribeKeys(() => {
      startGame();
      unsubscribeAnyActionKeyListener();
    });

    return () => {
      unsubscribeJumpListener();
      unsubscribeAnyActionKeyListener();
    };
  }, []);

  useFrame(({ camera }, delta) => {
    /**
     * Controls
     */
    const keys = getKeys();

    const pushVector = { x: 0, y: 0, z: 0 };
    const torqueVector = { x: 0, y: 0, z: 0 };

    const pushDelta = delta * PUSH_STRENGTH;
    const torqueDelta = delta * ROTATE_STRENGTH;

    if (keys.forward) {
      pushVector.z -= pushDelta;
      torqueVector.x -= torqueDelta;
    }
    if (keys.backward) {
      pushVector.z += pushDelta;
      torqueVector.x += torqueDelta;
    }
    if (keys.leftward) {
      pushVector.x -= pushDelta;
      torqueVector.z += torqueDelta;
    }
    if (keys.rightward) {
      pushVector.x += pushDelta;
      torqueVector.z -= torqueDelta;
    }

    marbleRef.current?.applyImpulse(pushVector);
    marbleRef.current?.applyTorqueImpulse(torqueVector);

    /**
     * Camera
     */
    const marblePos = marbleRef.current?.translation();

    const cameraPos = new Three.Vector3();
    cameraPos.copy(marblePos);
    cameraPos.z += 2.25;
    cameraPos.y += 0.65;

    smoothCameraPos.lerp(cameraPos, delta * 5);

    const cameraTarget = new Three.Vector3();
    cameraTarget.copy(marblePos);
    cameraTarget.y += 0.25;

    smoothCameraTarget.lerp(cameraTarget, delta * 5);

    camera.position.copy(smoothCameraPos);
    camera.lookAt(smoothCameraTarget);

    /**
     * Game state
     */

    if (marblePos.y < -4) {
      gameOver();
    }
  });

  return (
    <>
      <RigidBody
        ref={marbleRef}
        colliders="ball"
        position-y={1}
        restitution={0.2}
        friction={1}
        canSleep={false}
        linearDamping={0.5}
        angularDamping={0.5}
        onCollisionEnter={(col) => {
          if (col.colliderObject.name === "finish") {
            finishLevel();
          }
        }}
      >
        <mesh castShadow>
          <icosahedronGeometry args={[0.3, 1]} />
          <meshStandardMaterial
            color="mediumpurple"
            flatShading
            roughness={0.5}
            metalness={0.5}
          />
        </mesh>
      </RigidBody>
    </>
  );
};
