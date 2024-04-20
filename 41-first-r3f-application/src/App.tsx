import * as Three from "three";
import { Canvas } from "@react-three/fiber";

import { Experience } from "./experience";

export const App = () => {
  return (
    <div id="canvas-container">
      <Canvas
        // orthographic
        // camera={{
        //   position: [0, 75, 100],
        //   zoom: 100,
        // }}
        // flat // => LinearToneMapping
        gl={{
          antialias: true, // true by default
          toneMapping: Three.ACESFilmicToneMapping, // r3f default (wrong jsdoc)
          outputColorSpace: Three.SRGBColorSpace, // default (also in raw three nowadays)
          alpha: true, // r3f default
        }}
        dpr={[1, 2]} // r3f default
      >
        <Experience />
      </Canvas>
    </div>
  );
};
