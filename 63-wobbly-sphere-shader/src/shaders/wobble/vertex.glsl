#include ../includes/simplexNoise4d.glsl

uniform float uTime;

uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;

uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

attribute vec4 tangent;

varying float vWobble;

float getWobble(vec3 pos) {
    vec3 warpedPos = pos;

    warpedPos += simplexNoise4d(vec4(pos * uWarpPositionFrequency, uTime * uWarpTimeFrequency)) * uWarpStrength;

    return simplexNoise4d(vec4(
        warpedPos * uPositionFrequency, // XYZ
        uTime * uTimeFrequency
    )) * uStrength;
}

void main() {
    vec3 biTangent = cross(normal, tangent.xyz);

    // neighbors
    float dist = 0.01;
    vec3 positionA = csm_Position + tangent.xyz * dist;
    vec3 positionB = csm_Position + biTangent * dist;
    

    // Wobble
    float wobble = getWobble(csm_Position);
    float wobbleA = getWobble(positionA);
    float wobbleB = getWobble(positionB);

    csm_Position += wobble * normal;
    positionA += wobbleA * normal;
    positionB += wobbleB * normal;

    // compute normal
    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    // varyings
    vWobble = wobble / uStrength;
}