#include ../includes/simplexNoise2d.glsl

uniform float uPositionFrequency;
uniform float uWarpFrequency;
uniform float uStrength;
uniform float uWarpStrength;
uniform float uTime;
uniform float uSpeed;

varying vec3 vPosition;
varying float vUpDot;

float getElevation(vec2 pos) {

    vec2 warpedPos = pos;
    warpedPos += (uTime * uSpeed);
    warpedPos += simplexNoise2d(warpedPos * uPositionFrequency * uWarpFrequency) * uWarpStrength;

    float elevation = 0.0;
    elevation += simplexNoise2d(warpedPos * uPositionFrequency) / 2.0;
    elevation += simplexNoise2d(warpedPos * uPositionFrequency * 2.0) / 4.0;
    elevation += simplexNoise2d(warpedPos * uPositionFrequency * 4.0) / 8.0;

    float elevationSign = sign(elevation);
    elevation = abs(pow(elevation, 2.0)) * elevationSign;
    elevation *= uStrength;

    return elevation;
}


void main() {
    // neighbour
    float neighbourDist = 0.01;
    vec3 positionA = csm_Position + vec3(neighbourDist, 0.0, 0.0);
    vec3 positionB = csm_Position + vec3(0.0, 0.0, - neighbourDist);

    float elevation = getElevation(csm_Position.xz);
    positionA.y = getElevation(positionA.xz);
    positionB.y = getElevation(positionB.xz);

    csm_Position.y += elevation;

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    // varyings
    vPosition = csm_Position;
    vPosition.xz += (uTime * uSpeed);

    vUpDot = dot(csm_Normal, vec3(0.0, 1.0, 0.0));
}