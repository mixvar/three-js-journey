import * as THREE from "three";
import { Effect } from "postprocessing";

import { BlendFunction } from "postprocessing";

const FRAGMENT_SHADER = /* glsl */ `
    uniform float uFrequency;
    uniform float uAmplitude;
    uniform float uOffset;

    void mainUv(inout vec2 uv) {
        uv.y += sin(uv.x * uFrequency + uOffset) * uAmplitude;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

        // vec4 color = inputColor;
        // color.rgb *= vec3(0.8, 1.0, 0.5);
        // outputColor = color;

        outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
    }
`;

/**
 * @see https://github.com/pmndrs/postprocessing/wiki/Custom-Effects
 */
export class DrunkEffect extends Effect {
  constructor(props) {
    const {
      frequency = 5,
      amplitude = 0.1,
      blendFunction = BlendFunction.DARKEN,
    } = props;

    console.log("debug", { frequency, amplitude });

    super("DrunkEffect", FRAGMENT_SHADER, {
      uniforms: new Map([
        ["uFrequency", new THREE.Uniform(frequency)],
        ["uAmplitude", new THREE.Uniform(amplitude)],
        ["uOffset", new THREE.Uniform(0)],
      ]),
      blendFunction,
    });
  }

  update(_, __, delta) {
    this.uniforms.get("uOffset").value += delta;
  }
}
