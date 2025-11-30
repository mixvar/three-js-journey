vec3 halftone(
    vec3 color,
    float repetitions,
    vec3 direction,
    float low,
    float high,
    vec3 pointColor,
    vec3 normal,
    float alpha
) {
    // normalized absolute screen coords
    // divide only by .y to get square grid later,
    // also we usually do height based render scaling
    vec2 uv = gl_FragCoord.xy / uResolution.y; 

    // create grid coords
    vec2 gridUv = mod((uv *= repetitions), 1.0);

    // disk pattern
    float intensity = dot(normal, direction);
    intensity = smoothstep(low, high, intensity);

    float diskPattern = 1.0 - step(0.5 * intensity, distance(gridUv, vec2(0.5)));


    return mix(color, pointColor, diskPattern * alpha);
}