import { useEffect, useMemo, useRef } from "react";
import * as Three from "three";

export const CustomObject = () => {
  const verticesCount = 10 * 3;
  const positions = useMemo(
    () =>
      new Float32Array(verticesCount * 3).map(() => (Math.random() - 0.5) * 3),
    [verticesCount]
  );

  const geometryRef = useRef<Three.BufferGeometry>(null);
  useEffect(() => {
    geometryRef.current?.computeVertexNormals();
  }, [positions]);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          itemSize={3}
          count={verticesCount}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" side={Three.DoubleSide} />
    </mesh>
  );
};
