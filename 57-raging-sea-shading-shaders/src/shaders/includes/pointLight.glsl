
vec3 pointLight(
    vec3 lightColor,
    float lightIntensity,
    vec3 normal,
    vec3 lightPosition,
    vec3 viewDirection,
    float specularPower,
    vec3 position,
    float lightDecay
) {
    vec3 lightDirection =  normalize(lightPosition - position);
    vec3 lightReflection = reflect(-lightDirection, normal);
    float decay = max(0.0, 1.0 - distance(lightPosition, position) * lightDecay);
    float intensity = lightIntensity * decay;

    float shading = max(0.0, dot(lightDirection, normal));
    float specular = max(0.0, -dot(lightReflection, viewDirection));
    specular = pow(specular, specularPower);
    vec3 specularColor = specular * lightColor * intensity * 2.0;


    return lightColor * intensity * shading + specularColor;
}