uniform sampler2D uPerlinTexture;
uniform float uTime;

varying vec2 vUv;

void main() {
    // Scale and animate
    vec2 smokeUv = vUv;
    smokeUv.x *= 0.5;
    smokeUv.y *= 0.3;

    // animation for smoke going up, We need wrapS on the texture for repeat to make it work
    smokeUv.y -= uTime * 0.03; 

    float smoke = texture2D(uPerlinTexture, smokeUv).r;

    // remap alpha for more subtle smoke effect - it always returns value in [0, 1] range
    smoke = smoothstep(0.4, 1.0, smoke);

    // fade out the edges
    // smoke = 1.0;

    // float edgeFadeX = 1.0 - smoothstep(0.3, 0.5, abs(vUv.x - 0.5) * 1.0);
    // smoke *= edgeFadeX;
    
    // // fade out from top & bottom
    // float edgeFadeY = 1.0 - smoothstep(0.4, 0.5, abs(vUv.y - 0.5) * 1.0);
    // smoke *= edgeFadeY;
    
    // a simpler way to fade out edges
    
    // x
    smoke *= smoothstep(0.0, 0.2, vUv.x);
    smoke *= smoothstep(1.0, 0.8, vUv.x);

    // top
    smoke *= smoothstep(1.0, 0.4, vUv.y);
    // bottom
    smoke *= smoothstep(0.0, 0.1, vUv.y);
    
    gl_FragColor = vec4(0.8, 0.6, 0.5, smoke);
    // gl_FragColor = vec4(1.0);

    // three js injects code for handling renderer.toneMapping & make colors work properly
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}