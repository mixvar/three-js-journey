uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

#include ../includes/random2D.glsl

void main() {
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Glitch effect
    float glitchTime = uTime - modelPosition.y;
    float glitchStrength = (sin(glitchTime) + sin(glitchTime * 3.5) + sin(glitchTime * 8.7)) / 3.0;
    glitchStrength = smoothstep(0.3, 1.0, glitchStrength) * 0.2;
    modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
    modelPosition.y += (random2D(modelPosition.xy + uTime) - 0.5) * glitchStrength;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    vPosition = modelPosition.xyz;
    vNormal = (modelMatrix * vec4(normal, 0.0)).xyz; // 0.0 makes a homogenous vector so that translation is not applied to normal
}