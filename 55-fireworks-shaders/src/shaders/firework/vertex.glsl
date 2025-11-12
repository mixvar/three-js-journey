uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeFactor;

#include ../includes/remap.glsl

void main() {
    // aTimeFactor makes each particle have a different lifecycle, so animations are randomized
    float progress = uProgress * aTimeFactor; 
    vec3 newPosition = position;

    // explode animation
    float explodingProgress = clamp(remap(progress, 0.0, 0.1, 0.0, 1.0), 0.0, 1.0);
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition *= explodingProgress;

    // fall animation
    float fallingProgress = clamp(remap(progress, 0.1, 1.0, 0.0, 1.0), 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    newPosition.y -= fallingProgress * 0.2;

    // scaling animation
    float scaleUpProgress = clamp(remap(progress, 0.0, 0.125, 0.0, 1.0), 0.0, 1.0);
    float scaleDownProgress = clamp(remap(progress, 0.125, 1.0, 1.0, 0.0), 0.0, 1.0);
    float scaleFactor = min(scaleUpProgress, scaleDownProgress);

    // twinkle animation 
    float twinkleProgress = clamp(remap(progress, 0.2, 0.8, 0.0, 1.0), 0.0, 1.0);
    float twinkleFactor = abs(sin(progress * 40.0)) * 0.5 + 0.5;
    twinkleFactor = 1.0 - twinkleFactor * twinkleProgress;

    // position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;

    // size
    gl_PointSize = uSize * aSize * uResolution.y * scaleFactor * twinkleFactor;
    gl_PointSize *= 1.0 / - viewPosition.z; // perspective scaling

    // workaround for some GPUs not supporting size < 1 - hide particle by messing with position
    if (gl_PointSize < 1.0) {
        gl_Position = vec4(9999);
    }
}