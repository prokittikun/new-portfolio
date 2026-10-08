"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Background() {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(hasWebGL()), []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      {/* CSS fallback glow, also visible while the GL scene boots */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_40%,rgba(255,95,31,0.18),transparent_70%)]" />
      {ok && <ParticleField />}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_40%,rgba(7,7,10,0.85)_100%)]" />
    </div>
  );
}
