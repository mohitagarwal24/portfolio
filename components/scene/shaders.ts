// GLSL for the custom space materials. All lighting is driven by a single
// world-space sun direction (uSun) so Earth, atmosphere and glow agree.

export const earthVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const earthFragment = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform sampler2D uClouds;
  uniform vec3 uSun;
  uniform float uCloudShift;
  uniform float uLights;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    float ndl = dot(n, uSun);
    float dayMix = smoothstep(-0.1, 0.22, ndl);

    vec3 day = texture2D(uDay, vUv).rgb;
    vec3 night = texture2D(uNight, vUv).rgb;
    float clouds = texture2D(uClouds, vUv + vec2(uCloudShift, 0.0)).r;

    // Day side: diffuse land/ocean, clouds on top, ocean glint.
    float diffuse = max(ndl, 0.0);
    vec3 dayCol = day * (0.04 + 1.25 * diffuse);
    dayCol = mix(dayCol, vec3(0.95, 0.97, 1.0) * (0.03 + 1.15 * diffuse), clouds * 0.9);
    float water = smoothstep(0.02, 0.12, day.b - day.r);
    vec3 h = normalize(uSun + v);
    float glint = pow(max(dot(n, h), 0.0), 140.0) * water * (1.0 - clouds);
    dayCol += vec3(1.0, 0.82, 0.6) * glint * 0.55;

    // Night side: warm sodium-lamp city lights, dimmed under clouds.
    vec3 lights = pow(night, vec3(1.35)) * vec3(1.0, 0.68, 0.38) * uLights;
    vec3 nightCol = lights * (1.0 - clouds * 0.85) + day * 0.012;

    vec3 col = mix(nightCol, dayCol, dayMix);

    // Ignition-orange band along the terminator, blue haze toward the limb.
    float term = exp(-pow(ndl * 5.0, 2.0));
    col += vec3(1.0, 0.36, 0.08) * term * 0.09;
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    vec3 haze = mix(vec3(1.0, 0.42, 0.12), vec3(0.32, 0.62, 1.0), smoothstep(-0.05, 0.45, ndl));
    col += haze * fres * smoothstep(-0.35, 0.4, ndl) * 0.85;

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const atmosphereVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const atmosphereFragment = /* glsl */ `
  uniform vec3 uSun;
  uniform float uIntensity;
  uniform float uEdge; // -dot(v,n) where a ray grazes the planet: sqrt(1 - (r/R)^2)
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vPosW);
    // Back faces of an outer shell: 0 at the shell's outline, 1 at the planet's limb.
    float rim = pow(clamp(-dot(v, n) / uEdge, 0.0, 1.0), 2.5);
    float edge = 1.0;
    float sunSide = dot(n, uSun);
    vec3 col = mix(vec3(1.0, 0.38, 0.1), vec3(0.3, 0.6, 1.0), smoothstep(-0.1, 0.5, sunSide));
    float lit = smoothstep(-0.45, 0.25, sunSide);
    // Forward scattering when looking toward the sun through the limb.
    float scatter = pow(max(dot(-v, uSun), 0.0), 8.0);
    float a = rim * edge * (lit * 1.1 + scatter * 1.2) * uIntensity;
    gl_FragColor = vec4(col * a, a);
  }
`;

export const sunVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const sunFragment = /* glsl */ `
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float core = smoothstep(0.08, 0.0, d);
    float halo = pow(max(1.0 - d, 0.0), 6.0) * 0.9;
    float wide = pow(max(1.0 - d, 0.0), 2.5) * 0.18;
    vec3 col = vec3(1.0, 0.93, 0.82) * core * 12.0 + vec3(1.0, 0.6, 0.3) * halo * 2.0 + vec3(1.0, 0.45, 0.2) * wide;
    gl_FragColor = vec4(col * uIntensity, 1.0);
  }
`;

export const starVertex = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = aColor;
    vTwinkle = 0.75 + 0.25 * sin(uTime * (0.6 + aSeed * 2.2) + aSeed * 40.0);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio;
  }
`;

export const starFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, d);
    a = pow(a, 2.2);
    gl_FragColor = vec4(vColor * vTwinkle * a, a);
  }
`;

export const nebulaVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const nebulaFragment = /* glsl */ `
  varying vec3 vDir;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { float s = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
  void main() {
    vec3 d = normalize(vDir);
    // A tilted galactic band plus soft clouds of colour.
    vec3 axis = normalize(vec3(0.35, 1.0, 0.2));
    float band = exp(-pow(dot(d, axis) * 3.2, 2.0));
    float n = fbm(d * 3.0 + 7.0);
    float n2 = fbm(d * 6.0 - 3.0);
    vec3 violet = vec3(0.10, 0.07, 0.22);
    vec3 teal = vec3(0.03, 0.10, 0.16);
    vec3 ember = vec3(0.22, 0.09, 0.04);
    vec3 col = mix(teal, violet, n) * smoothstep(0.35, 0.85, n) * 0.55;
    col += ember * band * smoothstep(0.4, 0.9, n2) * 0.65;
    col += vec3(0.55, 0.6, 0.75) * band * pow(n2, 3.0) * 0.08;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;
