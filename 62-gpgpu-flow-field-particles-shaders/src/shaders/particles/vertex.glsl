uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticlesTexture; 

attribute vec2 aParticlesUv;
attribute float aParticleSize;
attribute vec3 aColor;

varying vec3 vColor;

void main()
{
    vec4 particleData = texture(uParticlesTexture, aParticlesUv);
    vec3 particlePos = particleData.rgb;
    float particleProgress = particleData.a;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(particlePos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Point size
    float sizeIn = smoothstep(0.0, 0.1, particleProgress);
    float sizeOut = 1.0 - smoothstep(0.7, 1.0, particleProgress);
    float size = min(sizeIn, sizeOut);

    gl_PointSize = size * uSize * aParticleSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varyings
    vColor = aColor;
}