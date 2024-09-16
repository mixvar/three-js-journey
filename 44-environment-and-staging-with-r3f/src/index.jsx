import * as THREE from "three";

import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";

import Experience from "./Experience.jsx";

import "./style.css";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <Canvas
    camera={{
      fov: 45,
      near: 0.1,
      far: 200,
      position: [-4, 3, 6],
    }}
    // shadows // enable shadows in webgl renderer
    // onCreated={({ gl, scene }) => {
    //   // default bg is transparent so it can be handled by HTML

    //   // we can set it both on renderer and scene, scene takes precedence
    //   gl.setClearColor("lightblue");
    //   scene.background = new THREE.Color("darkblue");
    // }}
  >
    {/* just to show how it can be done via JSX */}
    <color args={["ivory"]} attach={"background"} />
    <Experience />
  </Canvas>
);
