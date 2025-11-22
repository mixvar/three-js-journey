uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesSpeed;

uniform float uSmallWavesElevation;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesSpeed;
uniform float uSmallIterations;
uniform float uNeighbourDistance;

varying float vElevation;
varying vec3 vPosition;
varying vec3 vNormal;

#include ../includes/perlinClassic3D.glsl

float waveElevation(vec3 pos) {
    float elevation = 0.0;

    // big waves
    elevation = sin(pos.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                sin(pos.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                uBigWavesElevation;

    // small waves
    for(float i = 1.0; i <= uSmallIterations; i++) {
        elevation -= abs(perlinClassic3D(vec3(pos.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    return elevation;
}

void main()
{
    // positions
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    vec3 neighbourPosA = modelPosition.xyz; 
    vec3 neighbourPosB = modelPosition.xyz;
    neighbourPosA.x += uNeighbourDistance;
    neighbourPosB.z -= uNeighbourDistance; // we need this (-) so that normal points the right way

    // elevation
    float mainElevation = waveElevation(modelPosition.xyz);
    modelPosition.y += mainElevation;
    neighbourPosA.y += waveElevation(neighbourPosA);
    neighbourPosB.y += waveElevation(neighbourPosB);

    // normal
    // note: its' important that modelPosition transformations have been applied before this step
    vec3 toA = normalize(neighbourPosA - modelPosition.xyz);
    vec3 toB = normalize(neighbourPosB - modelPosition.xyz);
    vec3 computedNormal = cross(toA, toB);

    // final position 
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // varyings
    vElevation = mainElevation;
    vNormal = computedNormal;
    vPosition = modelPosition.xyz;
}