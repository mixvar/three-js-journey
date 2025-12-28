uniform vec2 uResolution;
uniform float uSize;
uniform float uProgress;
uniform vec3 uColor1;
uniform vec3 uColor2;

attribute float aSize;
attribute vec3 aPositionTarget;

varying vec3 vColor;

#include ../includes/simplexNoise3d.glsl

void main() {
    float noiseSamplingFactor = 0.2; // adjusts the resolution of the noise
    float noiseOrigin = smoothstep(-1.0, 1.0, simplexNoise3d(position * noiseSamplingFactor)); // remap to [0,1]
    float noiseTarget = smoothstep(-1.0, 1.0, simplexNoise3d(aPositionTarget * noiseSamplingFactor)); 
    float noise = mix(noiseOrigin, noiseTarget, uProgress);

    float duration = 0.4;
    float maxDelay = 1.0 - duration;

    float delay = maxDelay * noise;
    float end = delay + duration;
    float progress = smoothstep(delay, end, uProgress);

    vec3 currentPosition = mix(position, aPositionTarget, progress);


    // Final position
    vec4 modelPosition = modelMatrix * vec4(currentPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    gl_PointSize = aSize * uSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // varyings
    vColor = mix(uColor1, uColor2, noise); // mixing in vertex shader can be better for perf
}