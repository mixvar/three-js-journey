precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture; // special type for textures

varying vec2 vUv;
varying float vZOffset;

void main() {
    vec4 texel = texture2D(uTexture, vUv);

    gl_FragColor = texel * (vZOffset + 0.6) * 1.5;
    gl_FragColor.a = 1.0;

    // gl_FragColor = vec4(uColor, 1.0);

    // for testing values we have nothing better than 'visual" testing
    //  gl_FragColor = vec4(vUv, 0.0, 1.0);
}