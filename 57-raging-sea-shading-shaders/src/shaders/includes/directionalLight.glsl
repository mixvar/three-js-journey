// like sun rays, just coming from a direction
vec3 directionalLight(
    vec3 lightColor,
    float lightIntensity,
    vec3 normal,
    vec3 lightPosition,
    vec3 viewDirection,
    float specularPower
) {
    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(-lightDirection, normal);

    float shading = max(0.0, dot(lightDirection, normal));
    float specular = max(0.0, -dot(lightReflection, viewDirection));
    specular = pow(specular, specularPower);
    vec3 specularColor = specular * lightColor * lightIntensity * 2.0;


    return lightColor * lightIntensity * shading + specularColor;
}