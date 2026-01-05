// #define PI 3.1415926535897932384626433832795 // already defined by THREE

uniform float uSliceStart;
uniform float uSliceArc;
uniform vec3 uSliceColor;

varying vec3 vPosition;

void main() {
    float angle = atan(vPosition.y, vPosition.x);

    // offsetting the angle so it starts at uSliceStart
    // so that we can just use modulo later
    // NOTE: in JS modulo on negative values works differently
    angle -= uSliceStart;
    angle = mod(angle, 2.0 * PI);

    if (angle > 0.0 && angle < uSliceArc) {
        discard;
    }

    float csm_Slice;
}