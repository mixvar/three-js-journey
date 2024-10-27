import { OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  ToneMapping,
  Vignette,
  Glitch,
  Noise,
  Bloom,
  DepthOfField,
} from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction, GlitchMode } from "postprocessing";
import { Perf } from "r3f-perf";
import { useControls } from "leva";

import { Drunk } from "./custom-effects/Drunk";

export default function Experience() {
  return (
    <>
      <BuiltInEffectsDemo />
      {/* <CustomEffectDemo /> */}
    </>
  );
}

const BuiltInEffectsDemo = () => {
  const glowMultiplier = 10;

  return (
    <>
      {/* <color attach="background" args={["#4a4a4f"]} /> */}
      <color attach="background" args={["#fff"]} />

      <EffectComposer
      // multisampling={8} // default - gives us antialiasing
      >
        <Bloom luminanceThreshold={0} intensity={0.12} mipmapBlur />

        {/* tone mapping has to be managed by effect composer when doing post-processing
           instead of at the native renderer level so that each effect/pass operate on flat colors.
           We have to manually add tone mapping as an effect here (ACES_FILMIC is r3f default) */}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />

        <Vignette
          offset={0.3}
          darkness={0.55}
          blendFunction={BlendFunction.NORMAL}
        />

        <Glitch
          delay={[2, 10]}
          duration={[0.1, 0.5]}
          strength={[0.01, 0.1]}
          mode={GlitchMode.SPORADIC}
        />

        <Noise blendFunction={BlendFunction.OVERLAY} />

        <DepthOfField
          focusDistance={0.025}
          focalLength={0.025}
          bokehScale={6}
        />

        <Drunk
          frequency={6}
          amplitude={0.1}
          blendFunction={BlendFunction.OVERLAY}
        />
      </EffectComposer>

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        {/* <meshStandardMaterial color={"violet"} /> */}

        {/* <meshStandardMaterial color={[5, 2, 1]} toneMapped={false} /> */}

        {/* <meshStandardMaterial
            color={"white"}
            emissive={"orange"}
            emissiveIntensity={3}
            toneMapped={false}
          /> */}
        <meshBasicMaterial
          color={[1.5 * glowMultiplier, 1 * glowMultiplier, 4 * glowMultiplier]}
          toneMapped={false}
        />
      </mesh>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
};

const CustomEffectDemo = () => {
  const { frequency, amplitude } = useControls("DrunkEffect", {
    frequency: {
      value: 5,
      min: 0,
      max: 20,
      step: 0.01,
    },
    amplitude: {
      value: 0.1,
      min: 0,
      max: 1,
      step: 0.01,
    },
  });

  return (
    <>
      {/* <color attach="background" args={["#4a4a4f"]} /> */}
      <color attach="background" args={["#fff"]} />

      <EffectComposer>
        {/* tone mapping has to be managed by effect composer when doing post-processing
             instead of at the native renderer level so that each effect/pass operate on flat colors.
             We have to manually add tone mapping as an effect here (ACES_FILMIC is r3f default) */}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />

        <Drunk
          frequency={frequency}
          amplitude={amplitude}
          blendFunction={BlendFunction.DARKEN}
        />
      </EffectComposer>

      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
      <ambientLight intensity={1.5} />

      <mesh castShadow position-x={-2}>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <mesh castShadow position-x={2} scale={1.5}>
        <boxGeometry />
        <meshStandardMaterial color={"violet"} />
      </mesh>

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
};
