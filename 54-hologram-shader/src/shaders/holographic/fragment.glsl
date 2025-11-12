uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    float alpha = 1.0;

    // stripe pattern
    alpha *= pow(mod((vPosition.y - uTime * 0.05) * 15.0, 1.0), 3.0);

    // fresnel effect
    vec3 adjustedNormal = normalize(vNormal);
    if (!gl_FrontFacing) {
        adjustedNormal *= -1.0;
    }
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = pow(dot(viewDirection, adjustedNormal) + 1.0, 2.0);
    alpha *= fresnel;
    alpha += fresnel * 1.2;

    // falloff
    float falloff = smoothstep(0.8, 0.0, fresnel);
    alpha *= falloff;


    gl_FragColor = vec4(uColor, alpha);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}