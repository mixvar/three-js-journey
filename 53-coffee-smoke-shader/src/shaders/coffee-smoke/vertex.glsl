uniform sampler2D uPerlinTexture;
uniform float uTime;

varying vec2 vUv;

// import shared shader util fn
#include ../includes/rotate2D.glsl

void main() {
    vec3 newPosition = position;


    // Twist
    vec2 twistNoiseSampler = vec2(0.5, uv.y * 0.2 - uTime * 0.01);
    float twistNoise = texture2D(uPerlinTexture, twistNoiseSampler).r;
    float angle = twistNoise * 10.0;
    newPosition.xz = rotate2D(newPosition.xz, angle);


    // Wind
    float windNoiseX = texture2D(uPerlinTexture, vec2(0.25, uTime * 0.01)).r - 0.5;
    float windNoiseZ = texture2D(uPerlinTexture, vec2(0.65, uTime * 0.015)).r - 0.5;
    vec2 windOffset = vec2(windNoiseX, windNoiseZ);
    windOffset *= pow(uv.y, 2.0) * 10.0;

    newPosition.xz += windOffset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // varying
    vUv = uv;
}