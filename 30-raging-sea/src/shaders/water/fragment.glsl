uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

varying float vNormalizedElevation;

void main() {
    vec3 mixedColor = mix(uDepthColor, uSurfaceColor, vNormalizedElevation);

    gl_FragColor = vec4(mixedColor, 1.0);

    // for debugging 
    // gl_FragColor = vec4(vec3(vNormalizedElevation), 1.0);
    
    #include <colorspace_fragment>
}