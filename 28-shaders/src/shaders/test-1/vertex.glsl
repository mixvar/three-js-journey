// stay the same for all vertices in a gemotery
// provided by three.js
uniform mat4 modelMatrix; // transofmration relative to mesh - position, rotation, scale
uniform mat4 viewMatrix; // transofrmation relative to camera - position, rotatiom, fov, near, far
uniform mat4 projectionMatrix; // transform coordinates into clip space coordinates 

// [x,y,z] of a vertex to render; different for each execution
// same as geometry.attributes.position (except just one vector from an array)
attribute vec3 position; 

attribute float aRandom; // naming conventon - a prefix for attributes

// float someFunc(float a, float b) {
//     return a + b;
// }

varying float vRandom;

void main() {
    // vec2 foo = vec2(1.0, 2.0);
    // foo.x = 0.0;
    // foo *= 2.0;
    
    // vec3 color = vec3(0.0);
    // color.g = 0.5; // r/g/b aliases for x/y/z

    // vec2 wtf = color.gr; // we can create smaller vector like that xD "swizzle"

    // vec4 bar = vec4(1.0,2.0,3.0, 4.0); 
    // float bar_w = bar.w; // 2 ways to access 4th dimenstion
    // float bar_a = bar.a;

    // float someVar = someFunc(1.0, 2.0);

    // apply matrices to vector - by multiplying in the right order (read right to left)
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // do some transformation
    modelPosition.z += sin(modelPosition.x * 10.0) * 0.05 + (aRandom * 0.1);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // posiiton of vertex in clip space
    gl_Position = projectedPosition;
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vRandom = aRandom;
}