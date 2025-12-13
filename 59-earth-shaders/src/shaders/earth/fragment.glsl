uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;

uniform vec3 uSunDirection;

uniform vec3 uAtmosphereDayColor;
uniform vec3 uAtmosphereTwilightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    vec3 viewDirection = normalize(vPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    vec3 color = vec3(0.0);

    float sunExposure = dot(uSunDirection, normal);
    float fresnel = pow(dot(viewDirection, normal) + 1.0, 2.0);


    // day/night color
    float dayNightMix = smoothstep(-0.25, 0.5, sunExposure);
    vec3 dayColor = texture(uDayTexture, vUv).rgb;
    vec3 nightColor = texture(uNightTexture, vUv).rgb;
    color = mix(nightColor, dayColor, dayNightMix);

    // specular/clouds
    vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;

    // clouds
    float cloudMix = smoothstep(0.5, 1.0, specularCloudsColor.g);
    cloudMix = cloudMix * (dayNightMix + 0.003);
    color = mix(color, vec3(1.0), cloudMix);

    // atmosphere
    float atmosphereDayMix = smoothstep(-0.5, 1.0, sunExposure);
    vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtmosphereDayColor, atmosphereDayMix);
    color = mix(color, atmosphereColor, fresnel * atmosphereDayMix);

    // specular
    vec3 reflection = reflect(-uSunDirection, normal);
    float specular = pow(max(0.0, - dot(reflection, viewDirection)), 32.0);
    vec3 specularColor = mix(vec3(1.0), atmosphereColor, fresnel);
    color += specular * specularColor * specularCloudsColor.r;


    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}