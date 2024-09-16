import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Center,
  Instances,
  Instance,
  useMatcapTexture,
} from "@react-three/drei";
import { Perf } from "r3f-perf";

import { Text3D } from "@react-three/drei";

const DONUT_COUNT = 2500;
const DONUT_SPREAD = 80;

export default function Experience() {
  const [matcapTexture] = useMatcapTexture("7B5254_E9DCC7_B19986_C8AC91", 256);

  const donutConfigs = useMemo(
    () =>
      [...new Array(DONUT_COUNT)].map(() => ({
        scale: Math.random() * 0.3 + 0.2,
        position: [
          DONUT_SPREAD * (Math.random() - 0.5),
          DONUT_SPREAD * (Math.random() - 0.5),
          DONUT_SPREAD * (Math.random() - 0.5),
        ],
        rotation: [Math.PI * Math.random(), Math.PI * Math.random(), 0],
      })),
    []
  );

  const material = useMemo(() => {
    matcapTexture.colorSpace = THREE.SRGBColorSpace;
    matcapTexture.needsUpdate = true;

    const material = new THREE.MeshMatcapMaterial();
    material.matcap = matcapTexture;

    material.needsUpdate = true;
    return material;
  }, [matcapTexture]);

  const donutGeometry = useMemo(() => new THREE.TorusGeometry(), []);

  const donutsRef = useRef([]);
  useFrame((_, delta) => {
    donutsRef.current.forEach((donut) => {
      donut.rotation.y += 0.5 * delta;
    });
  });

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <Center>
        <Text3D
          font="./fonts/helvetiker_regular.typeface.json"
          size={2}
          height={0.3}
          curveSegments={10}
          bevelEnabled={true}
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={1}
          material={material}
        >
          mixvar
        </Text3D>
      </Center>

      <Instances
        limit={DONUT_COUNT}
        geometry={donutGeometry}
        material={material}
      >
        {donutConfigs.map(({ scale, position, rotation }, index) => (
          <Instance
            key={index}
            ref={(it) => (donutsRef.current[index] = it)}
            scale={scale}
            position={position}
            rotation={rotation}
          />
        ))}
      </Instances>
    </>
  );
}
