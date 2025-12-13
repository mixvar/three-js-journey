uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
    // displacement
    vec3 newPosition = position;
    float displacementIntensity = texture(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);
    vec3 displacement = vec3(cos(aAngle) * 0.5, sin(aAngle) * 0.5, 1.0);
    displacement = normalize(displacement);
    displacement *= displacementIntensity * aIntensity * 3.0;

    newPosition += displacement;



    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // picture
    float pictureIntensity = texture(uPictureTexture, uv).r;
    pictureIntensity += 0.1;
    


    // Point size
    gl_PointSize = 0.15 * uResolution.y * (pow(pictureIntensity, 0.9));
    gl_PointSize *= (1.0 / - viewPosition.z);

    // varyings
    vColor = vec3(pow(pictureIntensity, 1.5));
}