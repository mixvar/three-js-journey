import { Node, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

extend({
  OrbitControls,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    orbitControls: Node<OrbitControls, typeof OrbitControls>;
  }
}
