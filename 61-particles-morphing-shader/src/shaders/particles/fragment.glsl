
varying vec3 vColor;


void main()
{
    // point shape
    vec2 uv = gl_PointCoord;
    float d = distance(vec2(0.5), gl_PointCoord);
    float intensity = 0.05 / d  - 0.1;

    gl_FragColor = vec4(vColor, intensity);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}