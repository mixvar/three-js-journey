void main() {
    float centerDist = distance(gl_PointCoord, vec2(0.5));
    float intensity = 0.05 / centerDist - 0.05 * 2.0; // point light effect

    gl_FragColor = vec4(1.0, 1.0, 1.0, intensity);
}