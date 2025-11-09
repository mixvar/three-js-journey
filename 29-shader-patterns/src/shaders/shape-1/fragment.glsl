varying vec2 vUv;

// define syntax for constants
#define PI 3.141592653589793

// explore what uv coords look like
// void main() {
//     if (vUv.x < 0.2 && vUv.y < 0.2) {
//         gl_FragColor = vec4(0.0, 0.3, 1.0, 1.0);
//     } else if (vUv.x > 0.8 && vUv.y > 0.8) { 
//         gl_FragColor = vec4(0.1, 0.3, 0.4, 1.0);
//     } else {
//         gl_FragColor = vec4(0.5, 0.0, 1.0, 1.0);
//     }
// }

// pattern 1 - multpile overlaying gradients - own attemp
// void main() {
//     vec2 g1_anchor = vec2(0.0, 1.0);
//     vec2 g2_anchor = vec2(0.0, 0.0);
//     vec2 g3_anchor = vec2(1.0, 0.0);

//     float g1_intensity = 1.0 - distance(g1_anchor, vUv);
//     float g2_intensity = 1.0 - distance(g2_anchor, vUv);
//     float g3_intensity = 1.0 - distance(g3_anchor, vUv);

//     vec3 g1_color = vec3(0.62, 0.98, 1.0);
//     vec3 g2_color = vec3(0.3, 0.32, 1.0);
//     vec3 g3_color = vec3(0.91, 0.26, 1.0);

//     float r = ((g1_color.r * g1_intensity) + (g2_color.r * g2_intensity) + (g3_color.r * g3_intensity)) / 3.0;
//     float g = ((g1_color.g * g1_intensity) + (g2_color.g * g2_intensity) + (g3_color.g * g3_intensity)) / 3.0;
//     float b = ((g1_color.b * g1_intensity) + (g2_color.b * g2_intensity) + (g3_color.b * g3_intensity)) / 3.0;


//     gl_FragColor = vec4(r, g, b, 1.0);
// }

// pattern 1 - multpile overlaying gradients - lesson
// void main() {
//     gl_FragColor = vec4(vUv, 1.0, 1.0);
// }

// pattern 2 - 2 overlaying gradients
// void main() {
//     gl_FragColor = vec4(vUv, 0.0, 1.0);
// }

// pattern 3 - black to white x gradient
// void main() {
//     float strength = vUv.x;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 4 - black to white y gradient
// void main() {
//     float strength = vUv.y;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 5 - black to white y gradient inversed
// void main() {
//     float strength = 1.0 - vUv.y;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 6 - shifted gradient
// void main() {
//     float strength = vUv.y * 10.0;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 7 - many gradients horizontally
// void main() {
//     float strength = mod(vUv.y * 10.0, 1.0);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 8 - black/white stripes horizontally
// void main() {
//     float strength = step(0.5, mod(vUv.y * 10.0, 1.0));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 10 - black/white stripes vertically
// void main() {
//     float strength = step(0.8, mod(vUv.x * 10.0, 1.0));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 11 - kind of like grid
// void main() {
//     float strength = 0.0; 
//     strength += step(0.9, mod(vUv.x * 10.0, 1.0));
//     strength += step(0.9, mod(vUv.y * 10.0, 1.0));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 12 - dots grid
// void main() {
//     float strength = 0.0; 
//     strength += step(0.9, mod(vUv.x * 10.0, 1.0));
//     strength *= step(0.9, mod(vUv.y * 10.0, 1.0)); // creates intersection

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 13 - dots grid stretched in x axis
// void main() {
//     float strength = 0.0; 
//     strength += step(0.4, mod(vUv.x * 10.0, 1.0));
//     strength *= step(0.9, mod(vUv.y * 10.0, 1.0)); // creates intersection

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }


// pattern 14 - L grid
// void main() {
//     float pattern_a = 0.0; 
//     pattern_a += step(0.4, mod(vUv.x * 10.0, 1.0));
//     pattern_a *= step(0.8, mod(vUv.y * 10.0, 1.0)); // creates intersection
    
//     float pattern_b = 0.0; 
//     pattern_b += step(0.8, mod(vUv.x * 10.0, 1.0));
//     pattern_b *= step(0.4, mod(vUv.y * 10.0, 1.0)); // creates intersection

//     float strength = pattern_a + pattern_b;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 15 - + grid
// void main() {
//     float pattern_a = 0.0; 
//     pattern_a += step(0.4, mod(vUv.x * 10.0 , 1.0));
//     pattern_a *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0)); // creates intersection
    
//     float pattern_b = 0.0; 
//     pattern_b += step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
//     pattern_b *= step(0.4, mod(vUv.y * 10.0, 1.0)); // creates intersection

//     float strength = pattern_a + pattern_b;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 16 - mirrored gradient horizontal
// void main() {
//     // float strength = abs(1.0 - (vUv.x + 0.5));
//     float strength = abs(vUv.x - 0.5) * 2.0;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 17 - mirrored gradient cross
// void main() {
//     float pattern_x = abs(vUv.x - 0.5) * 2.0;
//     float pattern_y = abs(vUv.y - 0.5) * 2.0;
//     float strength = min(pattern_x, pattern_y);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 18 - mirrored gradient diamond?
// void main() {
//     float pattern_x = abs(vUv.x - 0.5) * 2.0;
//     float pattern_y = abs(vUv.y - 0.5) * 2.0;
//     float strength = max(pattern_x, pattern_y);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 19 - black square in the center
// void main() {
//     float pattern_x = abs(vUv.x - 0.5) * 2.0;
//     float pattern_y = abs(vUv.y - 0.5) * 2.0;
//     float strength = max(pattern_x, pattern_y);
//     strength = step(0.4, strength);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 20 - white square otuline
// void main() {
//     float pattern_x = abs(vUv.x - 0.5) * 2.0;
//     float pattern_y = abs(vUv.y - 0.5) * 2.0;
    
//     float a = max(pattern_x, pattern_y);
//     a = step(0.4, a);

//     float b = max(pattern_x, pattern_y);
//     b = 1.0 - step(0.5, b);

//     float strength = a * b;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 21 - lo-fi gradient x
// void main() {
//     float strength = floor(vUv.x * 10.0) / 10.0;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// // pattern 22 - lo-fi gradient x y
// void main() {
//     float a = floor(vUv.x * 10.0) / 10.0;
//     float b = floor(vUv.y * 10.0) / 10.0;
//     float strength = a * b;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// https://thebookofshaders.com/10/
// semi random result
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// pattern 23 - white noise
// void main() {
//     float strength = random(vUv);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 24 - white noise - big pixels 
// void main() {
//     float a = floor(vUv.x * 10.0) / 10.0;
//     float b = floor(vUv.y * 10.0) / 10.0;
//     vec2 gridUv = vec2(a,b);
//     float strength = random(gridUv);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 25 - white noise - big pixels + offset 
// void main() {
//     float a = floor(vUv.x * 10.0) / 10.0;
//     float b = floor(vUv.y * 10.0 + vUv.x * 5.0) / 10.0;
//     vec2 gridUv = vec2(a,b);
//     float strength = random(gridUv);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 26 - radial gradient
// void main() {
//     // float strength = distance(vUv, vec2(0.0));
//     float strength = length(vUv);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 27- radial gradient from the centre
// void main() {
//     // float strength = length(vUv - 0.5);
//     float strength = distance(vUv, vec2(0.5));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 28 - radial gradient from the centre inversed
// void main() {
//     float strength = 1.0 - distance(vUv, vec2(0.5));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 29 - radial gradient from the centre inversed, intensified - like a star
// void main() {
//     // float strength = (1.0 - distance(vUv, vec2(0.5)) * 5.0); // different effect
//     float strength = 0.02 / distance(vUv, vec2(0.5)) - 0.04;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 30 - as above but stretched X
// void main() {
//     vec2 lightUv = vec2(vUv) * vec2(0.1, 0.5) + vec2(0.45, 0.25);
//     float strength = 0.02 / distance(lightUv, vec2(0.5)) - 0.04;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 31 - as above but combined with Y to form a cross like effect
// void main() {
//     vec2 uv_a = vec2(vUv) * vec2(0.1, 0.5) + vec2(0.45, 0.25);
//     float a = 0.02 / distance(uv_a, vec2(0.5)) - 0.07;
    
//     vec2 uv_b = vec2(vUv) * vec2(0.5, 0.1) + vec2(0.25, 0.45);
//     float b = 0.02 / distance(uv_b, vec2(0.5)) - 0.07;

//     float strength = a * b;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

vec2 rotate(vec2 uv, float rotation, vec2 pivot) {
    return vec2(
        cos(rotation) * (uv.x - pivot.x) + sin(rotation) * (uv.y - pivot.x) + pivot.x,
        cos(rotation) * (uv.y - pivot.y) - sin(rotation) * (uv.x - pivot.y) + pivot.y
    );
}

// pattern 32 - as above but rotated 45 deg
// void main() {
//     vec2 rotated_uv_a = rotate(vUv, PI / 4.0, vec2(0.5));
//     vec2 uv_a = vec2(rotated_uv_a) * vec2(0.1, 0.5) + vec2(0.45, 0.25);
//     float a = 0.02 / distance(uv_a, vec2(0.5)) - 0.07;
    
//     vec2 rotated_uv_b = rotate(vUv, PI / -4.0, vec2(0.5));
//     vec2 uv_b = vec2(rotated_uv_b) * vec2(0.1, 0.5) + vec2(0.45, 0.25);
//     float b = 0.02 / distance(uv_b, vec2(0.5)) - 0.07;

//     float strength = a * b;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 33 - simple black circle
// void main() {
//     float strength = step(0.25, distance(vUv, vec2(0.5)));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 34 - 2 overlaying circular gradients
// void main() {
//     float strength = abs(distance(vUv, vec2(0.5)) - 0.25);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 35 - circle outline
// void main() {
//     // float a = step(0.2, distance(vUv, vec2(0.5)));
//     // float b = 1.0 - step(0.22, distance(vUv, vec2(0.5)));
//     // float strength = 1.0 - (a * b);

//     float strength = step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }


// pattern 36 - circle outline inversed
// void main() {
//     float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 37 - circle outline inversed + wavy deformation
// void main() {
//     vec2 uv_waved = vec2(
//         vUv.x,
//         vUv.y + sin(vUv.x * 30.0) * 0.1
//     );
//     float strength = 1.0 - step(0.01, abs(distance(uv_waved, vec2(0.5)) - 0.25));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 38 - a blob sort of
// void main() {
//     vec2 uv_waved = vec2(
//         vUv.x + sin(vUv.y * 40.0) * 0.1,
//         vUv.y + sin(vUv.x * 40.0) * 0.1
//     );
//     float strength = 1.0 - step(0.01, abs(distance(uv_waved, vec2(0.5)) - 0.25));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 39 - another blob
// void main() {
//     vec2 uv_waved = vec2(
//         vUv.x + sin(vUv.y * 100.0) * 0.1,
//         vUv.y + sin(vUv.x * 100.0) * 0.1
//     );
//     float strength = 1.0 - step(0.01, abs(distance(uv_waved, vec2(0.5)) - 0.25));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// // pattern 40 angular gradient sort of 
// void main() {
//     float angle = atan(vUv.x, vUv.y);
//     float strength = angle;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 41 - as above but shifted
// void main() {
//     float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
//     float strength = angle;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 42 - cool radial radient form centre
// void main() {
//     float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
//     angle /= PI * 2.0;
//     angle += 0.5;

//     float strength = angle;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 43 - multiple angle gradients
// void main() {
//     float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
//     angle /= PI * 2.0;
//     angle += 0.5;
//     angle *= 20.0;
//     angle = mod(angle, 1.0);

//     float strength = angle;

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 44 - multiple angle gradients - other variation
// void main() {
//     float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
//     angle /= PI * 2.0;
//     angle += 0.5;


//     float strength = sin(angle * 100.0);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 45 - waved circle
// void main() {
//     float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
//     angle /= PI * 2.0;
//     angle += 0.5;

//     float sinusoid = sin(angle * 100.0);
//     float radius = 0.25 + sinusoid * 0.02;

//     float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }


// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83#classic-perlin-noise
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float perlin2dNoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// pattern 46 - PERLIN NOISE
// void main() {
//     float strength = perlin2dNoise(vUv * 10.0);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 47 - moro pattern
// void main() {
//     float strength = step(0.0, perlin2dNoise(vUv * 10.0));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 48 - psycho bacteria
// void main() {
//     float strength = 1.0 - abs(perlin2dNoise(vUv * 10.0));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 49 - pschodelic drug abuse
// void main() {
//     float strength = sin(perlin2dNoise(vUv * 10.0) * 20.0);

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 49 - pschodelic drug abuse - sharper
// void main() {
//     float strength = step(0.8, sin(perlin2dNoise(vUv * 10.0) * 20.0));

//     gl_FragColor = vec4(vec3(strength), 1.0);
// }

// pattern 50 - perlin + colors
void main() {
    float strength = step(0.8, sin(perlin2dNoise(vUv * 10.0) * 20.0));

    vec3 blackColor = vec3(0.0);
    vec3 uvColor = vec3(vUv, 0.5);

    vec3 mixedColor = mix(blackColor, uvColor, strength);

    gl_FragColor = vec4(mixedColor, 1.0);
}

// pattern 51 - fix strength over 1
// void main() {
//     float strength = 0.0; 
//     strength += step(0.9, mod(vUv.x * 10.0, 1.0));
//     strength += step(0.9, mod(vUv.y * 10.0, 1.0));

//     // clamp the strength
//     strength = clamp(strength, 0.0, 1.0);

//     vec3 blackColor = vec3(0.0);
//     vec3 uvColor = vec3(vUv, 0.5);

//     vec3 mixedColor = mix(blackColor, uvColor, strength);

//     gl_FragColor = vec4(mixedColor, 1.0);
// }

// TODO: try to finish first attempt at mixed gradients
// TODO: try to animate some of the shapes