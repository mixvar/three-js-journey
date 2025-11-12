// like smoothstep but not linear
float remap(
    float value,
    float originMin,
    float originMax,
    float destinationMin,
    float destinationMax
) {
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}