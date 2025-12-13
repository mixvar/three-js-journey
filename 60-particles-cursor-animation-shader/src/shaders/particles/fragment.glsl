uniform sampler2D uPictureTexture;

varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;

    // disk 
    float d = length(uv -  vec2(0.5, 0.5));

    if (d > 0.5) {
        // this results in the same effect as playing with opacity,
        // but does not cause problems with depth buffer
        discard;
    }
    
    gl_FragColor = vec4(vColor, 1.0);
    
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}