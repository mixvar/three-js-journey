uniform mat4 modelMatrix;
uniform mat4 viewMatrix; 
uniform mat4 projectionMatrix;

uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position; 
attribute vec2 uv; 

attribute float aRandom; 

varying vec2 vUv;
varying float vZOffset;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float zOffset = 0.0;
    zOffset += sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    zOffset += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z = zOffset;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // we take default uv coords from THREE geometry 
    // and pass to fragment shader as varying
    vUv = uv; 

    vZOffset = zOffset;
}