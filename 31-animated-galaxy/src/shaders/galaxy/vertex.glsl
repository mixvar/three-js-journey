uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;

attribute float aScaleFactor;
attribute vec3 aRandomOffsets;

varying vec3 vColor;

void main() {
    vec4 modelposition = modelMatrix * vec4(position, 1.0);

    float angle = atan(modelposition.x, modelposition.z);
    float centerDistance = length(modelposition.xz);
    float angleOffset = (1.0 / centerDistance) * uTime * 0.2;

    modelposition.x = cos(angle + angleOffset) * centerDistance;
    modelposition.z = sin(angle + angleOffset) * centerDistance;

    modelposition.xyz += aRandomOffsets;

    vec4 viewPosition = viewMatrix * modelposition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    
    // size of a fragment
    gl_PointSize = uSize * uPixelRatio * aScaleFactor;
    
    // size attenuation - see points.gls.js in three.js source
    gl_PointSize *= (1.0 / - viewPosition.z);

    vColor = color;
}