// obligatory

// precision lowp float;
precision mediump float;
// precision highp float;

varying float vRandom;

void main() {
    // color of individual fragment (almost like a pixel)
    // alpha channel only works if we active 'transparent' on three js material
    gl_FragColor = vec4(0.5, vRandom, 1.0, 0.8);
}