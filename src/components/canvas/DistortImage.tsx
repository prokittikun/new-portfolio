"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { imageFragment, imageVertex } from "./shaders";

type Pointer = { x: number; y: number; inside: boolean };

function Plane({ src, pointer }: { src: string; pointer: React.RefObject<Pointer> }) {
  const tex = useLoader(THREE.TextureLoader, src);
  const { viewport, size } = useThree();
  const last = useRef(new THREE.Vector2(0.5, 0.5));

  // Build the material ourselves: R3F clones a `uniforms` prop, so per-frame
  // writes to our object would never reach the GPU.
  const material = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const img = tex.image as HTMLImageElement;
    return new THREE.ShaderMaterial({
      vertexShader: imageVertex,
      fragmentShader: imageFragment,
      uniforms: {
        uTex: { value: tex },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uVelocity: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
        uTime: { value: 0 },
        uPlane: { value: new THREE.Vector2(1, 1) },
        uImage: { value: new THREE.Vector2(img.width, img.height) },
      },
    });
  }, [tex]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const u = material.uniforms;
    const p = pointer.current;
    u.uTime.value += dt;
    u.uPlane.value.set(size.width, size.height);
    u.uHover.value = THREE.MathUtils.damp(u.uHover.value, p.inside ? 1 : 0, 4, dt);
    const target = new THREE.Vector2(p.x, p.y);
    u.uMouse.value.lerp(target, 1 - Math.exp(-dt * 10));
    const vel = u.uMouse.value.clone().sub(last.current);
    last.current.copy(u.uMouse.value);
    u.uVelocity.value.lerp(vel.multiplyScalar(0.6), 1 - Math.exp(-dt * 6));
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/**
 * Photo rendered through a WebGL shader: warm duotone at rest, a liquid lens
 * that reveals true color under the cursor, and RGB split on fast movement.
 */
export default function DistortImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const pointer = useRef<Pointer>({ x: 0.5, y: 0.5, inside: false });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    pointer.current.x = (e.clientX - r.left) / r.width;
    pointer.current.y = 1 - (e.clientY - r.top) / r.height;
  };

  return (
    <div
      className={className}
      role="img"
      aria-label={alt}
      onPointerMove={onMove}
      onPointerEnter={() => (pointer.current.inside = true)}
      onPointerLeave={() => (pointer.current.inside = false)}
      data-cursor="lens"
    >
      <Canvas orthographic camera={{ zoom: 1, position: [0, 0, 5] }} dpr={[1, 2]} gl={{ antialias: false }} flat>
        <Suspense fallback={null}>
          <Plane src={src} pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  );
}

