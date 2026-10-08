"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { sceneState } from "@/lib/scene-state";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

// Section ids that act as keyframes for the particle morph (sphere → galaxy).
const STAGE_IDS = ["home", "about", "work", "projects", "contact"];

function computeProgress() {
  const vh = window.innerHeight;
  const probe = window.scrollY + vh * 0.55;
  const tops: number[] = [];
  for (const id of STAGE_IDS) {
    const el = document.getElementById(id);
    if (!el) return null;
    tops.push(el.getBoundingClientRect().top + window.scrollY);
  }
  if (probe <= tops[0]) return 0;
  for (let i = 0; i < tops.length - 1; i++) {
    if (probe < tops[i + 1]) {
      const span = Math.max(1, tops[i + 1] - tops[i]);
      // Hold the current shape for the first half of a section, then morph.
      const f = Math.min(1, Math.max(0, ((probe - tops[i]) / span - 0.45) / 0.55));
      return i + f;
    }
  }
  return tops.length - 1;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const instance = reduce
      ? null
      : new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), wheelMultiplier: 1 });
    setLenis(instance);

    let raf = 0;
    const loop = (time: number) => {
      instance?.raf(time);
      const p = computeProgress();
      // Sub-pages have no stage sections; park the cloud as a dim helix.
      sceneState.progress = p ?? 3;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      instance?.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function scrollToId(lenis: Lenis | null, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}
