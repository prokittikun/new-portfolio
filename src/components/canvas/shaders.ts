// Ashima Arts 3D simplex noise (MIT)
export const simplexNoise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

export const particleVertex = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uPixelRatio;
uniform float uSize;
uniform float uHyper;
uniform vec3 uMouse;

attribute vec3 aKnot;
attribute vec3 aWave;
attribute vec3 aHelix;
attribute vec3 aGalaxy;
attribute float aRandom;

varying float vAlpha;
varying vec3 vColor;

${simplexNoise}

float stage(float p, float i, float r) {
  // Per-particle stagger so morphs ripple instead of snapping in lockstep.
  return smoothstep(0.0, 1.0, clamp((p - i) * 1.35 - r * 0.35, 0.0, 1.0));
}

void main() {
  float p = uProgress;
  vec3 pos = position;
  pos = mix(pos, aKnot,   stage(p, 0.0, aRandom));
  pos = mix(pos, aWave,   stage(p, 1.0, aRandom));
  pos = mix(pos, aHelix,  stage(p, 2.0, aRandom));
  pos = mix(pos, aGalaxy, stage(p, 3.0, aRandom));

  // Rolling ocean when the wave stage is dominant.
  float waveW = stage(p, 1.0, 0.0) * (1.0 - stage(p, 2.0, 0.0));
  pos.y += waveW * (sin(pos.x * 0.9 + uTime * 1.1) * 0.35 + cos(pos.z * 1.3 + uTime * 0.8) * 0.25);

  // Galaxy slowly swirls.
  float galW = stage(p, 3.0, 0.0);
  float ang = galW * uTime * 0.08 * (1.0 + 1.5 / (length(pos.xz) + 0.5));
  pos.xz = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * pos.xz;

  // Organic breathing.
  float n = snoise(pos * 0.55 + vec3(0.0, uTime * 0.12, 0.0));
  float amp = 0.12 + uHyper * 0.9;
  pos += normalize(pos + 0.0001) * n * amp;

  vec4 world = modelMatrix * vec4(pos, 1.0);

  // Push particles away from the cursor (in world space, on the view plane).
  vec2 d = world.xy - uMouse.xy;
  float dist = length(d);
  float force = smoothstep(1.6, 0.0, dist);
  world.xy += normalize(d + 0.0001) * force * (0.55 + uHyper);
  world.z += force * 0.6;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.35 + aRandom * 0.9) * (1.0 + force * 1.5 + uHyper * 0.8);
  gl_PointSize = size * uPixelRatio * (1.0 / -mv.z);

  vec3 orange = vec3(1.0, 0.37, 0.12);
  vec3 cream  = vec3(1.0, 0.86, 0.68);
  vec3 violet = vec3(0.48, 0.36, 1.0);
  float t = n * 0.5 + 0.5;
  vec3 col = mix(orange, cream, smoothstep(0.35, 0.95, t));
  col = mix(col, violet, smoothstep(0.75, 1.0, aRandom) * 0.6);
  // Hyperdrive cycles hue through acid/cyan.
  vec3 hyperCol = 0.5 + 0.5 * cos(uTime * 3.0 + aRandom * 6.28 + vec3(0.0, 2.0, 4.0));
  vColor = mix(col, hyperCol, uHyper) + force * 0.6;
  vAlpha = 0.55 + 0.45 * t;
}
`;

export const particleFragment = /* glsl */ `
uniform float uOpacity;
varying float vAlpha;
varying vec3 vColor;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a = pow(a, 1.6);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a * vAlpha * uOpacity * 0.75);
}
`;

export const imageVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const imageFragment = /* glsl */ `
uniform sampler2D uTex;
uniform vec2 uMouse;
uniform vec2 uVelocity;
uniform float uHover;
uniform float uTime;
uniform vec2 uPlane;
uniform vec2 uImage;
varying vec2 vUv;

${simplexNoise}

vec2 cover(vec2 uv) {
  float rs = uPlane.x / uPlane.y;
  float ri = uImage.x / uImage.y;
  vec2 scale = rs < ri ? vec2(rs / ri, 1.0) : vec2(1.0, ri / rs);
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uPlane.x / uPlane.y, 1.0);
  float dist = distance(uv * aspect, uMouse * aspect);

  // Liquid lens around the cursor.
  float lens = smoothstep(0.32, 0.0, dist) * uHover;
  float n = snoise(vec3(uv * 4.0, uTime * 0.4));
  uv += (uv - uMouse) * -lens * 0.18 + n * 0.006 * uHover;

  // RGB split driven by cursor velocity.
  vec2 shift = uVelocity * 0.6 * (0.3 + lens);
  vec2 c = cover(uv);
  float r = texture2D(uTex, c + shift).r;
  float g = texture2D(uTex, c).g;
  float b = texture2D(uTex, c - shift).b;
  vec3 col = vec3(r, g, b);

  // Warm duotone at rest, true color under the lens.
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  vec3 duo = mix(vec3(0.05, 0.03, 0.04), vec3(1.0, 0.55, 0.28), lum);
  float reveal = clamp(lens * 2.2 + uHover * 0.35, 0.0, 1.0);
  col = mix(duo, col, reveal);

  // Scanlines + vignette.
  col *= 0.94 + 0.06 * sin(vUv.y * 900.0 + uTime * 6.0);
  float v = smoothstep(1.1, 0.35, distance(vUv, vec2(0.5)));
  col *= v;

  gl_FragColor = vec4(col, 1.0);
}
`;
