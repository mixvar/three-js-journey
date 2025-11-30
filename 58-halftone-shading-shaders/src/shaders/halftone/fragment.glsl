uniform vec3 uColor;
uniform vec3 uShadowColor;
uniform vec3 uLightColor;
uniform vec2 uResolution;
uniform float uShadowRepetitions;
uniform float uLightRepetitions;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/halftone.glsl

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = uColor;

    // Lights
    vec3 light = vec3(0.0);

    light += ambientLight(
        vec3(1.0),
        1.0
    );

    vec3 lightDir = vec3(1.0, 1.0, 0.0);

    light += directionalLight(
        vec3(1.0),
        1.0,
        normal,
        lightDir,
        viewDirection,
        1.0
    );

    color *= light;

    // light halftone
    color = halftone(
        color,
        uLightRepetitions,
        lightDir,
        - 0.5,
        1.5,
        uLightColor,
        normal,
        0.8
    );

    // shadow halftone
    color = halftone(
        color,
        uShadowRepetitions,
        -lightDir,
        - 0.8,
        1.5,
        uShadowColor,
        normal,
        0.7
    );

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}