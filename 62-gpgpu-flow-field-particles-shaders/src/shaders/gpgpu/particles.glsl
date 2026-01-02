// this is a fragment shader operating on the data texture managed by GPUComputationRenderer

uniform float uTime;
uniform float uDeltaTime;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrength;
uniform float uFlowFieldFrequency;
uniform sampler2D uBaseTexture;

// uniform sampler2D uParticlePositionsTexture; // data texture (already injected by the renderer)
#include ../includes/simplexNoise4d.glsl

void main() {
    float time = uTime * 0.2;
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture(uParticlePositionsTexture, uv);
    vec4 particleBase = texture(uBaseTexture, uv);

    if (particle.a >= 1.0) {
        // particle decayed
        particle.a = mod(particle.a, 1.0); // reset alpha in a way that prevents alpha sync after long frame
        particle.xyz = particleBase.xyz;
    } else {
        // alive
        // Flow field
        float fieldStrength = uFlowFieldStrength * simplexNoise4d(vec4(particleBase.xyz * 0.2, time + 1.0));
        float influence = (uFlowFieldInfluence - 0.5) * -2.0;
        fieldStrength = smoothstep(influence, 1.0, fieldStrength);

        vec3 flowField = normalize(vec3(
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 0.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 1.0, time)),
            simplexNoise4d(vec4(particle.xyz * uFlowFieldFrequency + 2.0, time))
        ));

        // we need to use uDeltaTime to get animation speed independent from framerate
        particle.xyz += uDeltaTime * flowField * fieldStrength;
        particle.a += uDeltaTime * 0.2;
    }
   
    gl_FragColor = particle;
}