import { OrbitControls } from "@react-three/drei";
import { useControls, button } from "leva";
import { Perf } from "r3f-perf";

export default function Experience() {
  const sphereControls = useControls("sphere", {
    position: {
      value: { x: -2, y: 0 },
    },
    Color: `#ff0000`,
    visible: true,
  });

  const miscControls = useControls("misc", {
    perfVisible: true,
    choice: {
      options: ["a", "b", "c"],
    },
    click: button(() => {
      console.log("clicked!");
    }),
  });

  return (
    <>
      {miscControls.perfVisible && <Perf position="top-left" />}

      <OrbitControls makeDefault />

      <directionalLight position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh
        position={[sphereControls.position.x, 0, sphereControls.position.y]}
        visible={sphereControls.visible}
      >
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color={sphereControls.Color} />
      </mesh>

      <mesh position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
}
