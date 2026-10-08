"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { sceneState } from "@/lib/scene-state";
import { particleFragment, particleVertex } from "./shaders";

function buildShapes(count: number) {
  const sphere = new Float32Array(count * 3);
  const knot = new Float32Array(count * 3);
  const wave = new Float32Array(count * 3);
  const helix = new Float32Array(count * 3);
  const galaxy = new Float32Array(count * 3);
  const random = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const r = Math.random();
    random[i] = r;

    // Fibonacci sphere with a little depth jitter.
    const y = 1 - (i / (count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = golden * i;
    const R = 2.1 * (0.92 + Math.random() * 0.12);
    sphere[i3] = Math.cos(th) * rad * R;
    sphere[i3 + 1] = y * R;
    sphere[i3 + 2] = Math.sin(th) * rad * R;

    // (2,3) torus knot with a fuzzy tube.
    const t = (i / count) * Math.PI * 2;
    const p = 2;
    const q = 3;
    const kr = 1.35 + 0.55 * Math.cos(q * t);
    const kx = kr * Math.cos(p * t);
    const ky = kr * Math.sin(p * t);
    const kz = 0.55 * Math.sin(q * t);
    const tube = 0.32 * Math.sqrt(Math.random());
    const ta = Math.random() * Math.PI * 2;
    knot[i3] = kx + Math.cos(ta) * tube;
    knot[i3 + 1] = ky + Math.sin(ta) * tube;
    knot[i3 + 2] = kz + Math.cos(ta + 1.3) * tube;

    // Wave terrain grid.
    const cols = Math.ceil(Math.sqrt(count * 1.8));
    const gx = i % cols;
    const gz = Math.floor(i / cols);
    const rows = Math.ceil(count / cols);
    wave[i3] = (gx / cols - 0.5) * 11;
    wave[i3 + 1] = -1.1;
    wave[i3 + 2] = (gz / rows - 0.5) * 6;

    // DNA double helix laid horizontally.
    const strand = i % 3;
    const ht = (i / count) * 2 - 1;
    const hx = ht * 6.5;
    const phase = ht * Math.PI * 5;
    const hr = 1.05;
    if (strand < 2) {
      const off = strand === 0 ? 0 : Math.PI;
      helix[i3] = hx + (Math.random() - 0.5) * 0.08;
      helix[i3 + 1] = Math.cos(phase + off) * hr + (Math.random() - 0.5) * 0.12;
      helix[i3 + 2] = Math.sin(phase + off) * hr + (Math.random() - 0.5) * 0.12;
    } else {
      // Rungs between strands, snapped to discrete steps.
      const step = Math.round(ht * 40) / 40;
      const sp = step * Math.PI * 5;
      const k = Math.random() * 2 - 1;
      helix[i3] = step * 6.5;
      helix[i3 + 1] = Math.cos(sp) * hr * k;
      helix[i3 + 2] = Math.sin(sp) * hr * k;
    }

    // Spiral galaxy with 3 arms.
    const arms = 3;
    const arm = i % arms;
    const gr = Math.pow(Math.random(), 1.6) * 4.2 + 0.05;
    const spin = gr * 1.25;
    const ga = (arm / arms) * Math.PI * 2 + spin;
    const spread = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45 * gr;
    galaxy[i3] = Math.cos(ga) * gr + spread;
    galaxy[i3 + 1] = (Math.random() - 0.5) * 0.25 * (4.5 - gr) * 0.25;
    galaxy[i3 + 2] = Math.sin(ga) * gr + spread * 0.6;
  }

  return { sphere, knot, wave, helix, galaxy, random };
}

// Where the cloud sits on screen for each stage (desktop).
const STAGE_POS = [
  { x: 2.3, y: 0, rx: 0, s: 1 },
  { x: -2.6, y: 0, rx: 0.3, s: 0.95 },
  { x: 0, y: -2.3, rx: 0.32, s: 1.1 },
  { x: 0, y: 0, rx: 0.2, s: 0.9 },
  { x: 1.2, y: -0.4, rx: 1.1, s: 1.25 },
];
const STAGE_OPACITY = [1, 0.7, 0.5, 0.35, 0.9].map((v) => ({ v }));

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function sampleStage<T extends Record<string, number>>(arr: T[], p: number, key: keyof T) {
  const i = Math.min(Math.floor(p), arr.length - 1);
  const j = Math.min(i + 1, arr.length - 1);
  const f = p - i;
  const s = f * f * (3 - 2 * f);
  return lerp(arr[i][key] as number, arr[j][key] as number, s);
}

function Particles({ count, mobile }: { count: number; mobile: boolean }) {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef(new THREE.Vector3(99, 99, 0));
  const smooth = useRef({ progress: 0, hyper: 0 });
  const { viewport, gl } = useThree();

  const geometry = useMemo(() => {
    const s = buildShapes(count);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(s.sphere, 3));
    g.setAttribute("aKnot", new THREE.BufferAttribute(s.knot, 3));
    g.setAttribute("aWave", new THREE.BufferAttribute(s.wave, 3));
    g.setAttribute("aHelix", new THREE.BufferAttribute(s.helix, 3));
    g.setAttribute("aGalaxy", new THREE.BufferAttribute(s.galaxy, 3));
    g.setAttribute("aRandom", new THREE.BufferAttribute(s.random, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12);
    return g;
  }, [count]);

  // Own the material instance: R3F clones a `uniforms` prop, which would
  // detach it from the per-frame updates below.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
          uSize: { value: mobile ? 22 : 26 },
          uHyper: { value: 0 },
          uOpacity: { value: 1 },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
        },
      }),
    [gl, mobile],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const u = material.uniforms;
    u.uTime.value += dt * (1 + smooth.current.hyper * 2.5);

    const sm = smooth.current;
    sm.progress = THREE.MathUtils.damp(sm.progress, sceneState.progress, 3.2, dt);
    const hyperTarget = performance.now() < sceneState.hyperUntil ? 1 : 0;
    sm.hyper = THREE.MathUtils.damp(sm.hyper, hyperTarget, 2, dt);
    u.uProgress.value = sm.progress;
    u.uHyper.value = sm.hyper;
    u.uOpacity.value = sampleStage(STAGE_OPACITY, sm.progress, "v");

    // Cursor on the z=0 plane.
    const target = new THREE.Vector3(
      (state.pointer.x * viewport.width) / 2,
      (state.pointer.y * viewport.height) / 2,
      0,
    );
    mouse.current.lerp(target, 1 - Math.exp(-dt * 8));
    u.uMouse.value.copy(mouse.current);

    const g = group.current;
    if (!g) return;
    const px = mobile ? 0 : sampleStage(STAGE_POS, sm.progress, "x");
    const py = sampleStage(STAGE_POS, sm.progress, "y");
    const rx = sampleStage(STAGE_POS, sm.progress, "rx");
    const sc = sampleStage(STAGE_POS, sm.progress, "s") * (mobile ? 0.72 : 1);
    g.position.x = THREE.MathUtils.damp(g.position.x, px, 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, py, 4, dt);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, sc, 4, dt));
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rx + state.pointer.y * 0.15, 3, dt);
    g.rotation.y += dt * (0.06 + sm.hyper * 0.8);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -state.pointer.x * 0.1, 3, dt);
  });

  return (
    <group ref={group}>
      <points geometry={geometry} material={material} />
    </group>
  );
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

export default function ParticleField() {
  const mobile = useIsMobile();
  const count = mobile ? 9000 : 22000;

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      dpr={[1, mobile ? 1.5 : 1.75]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <color attach="background" args={["#07070a"]} />
      <Particles key={count} count={count} mobile={mobile} />
      {!mobile && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.65} luminanceThreshold={0.2} luminanceSmoothing={0.4} radius={0.7} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
