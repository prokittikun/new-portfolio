"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "default" | "link" | "lens" | "text" | "drag";

/**
 * Two-part cursor: a precise dot and a lagging ring that morphs based on the
 * hovered element's `data-cursor` attribute (or link/button by default).
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const lag = { ...pos };
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        lag.x = pos.x;
        lag.y = pos.y;
        dot.current?.style.setProperty("opacity", "1");
        ring.current?.style.setProperty("opacity", "1");
      }
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor],a,button,input,textarea");
      if (!target) {
        setMode("default");
        setLabel("");
        return;
      }
      const m = target.dataset.cursor as Mode | undefined;
      setMode(m ?? (target.matches("input,textarea") ? "text" : "link"));
      setLabel(target.dataset.cursorLabel ?? "");
    };
    const onLeave = () => {
      visible = false;
      dot.current?.style.setProperty("opacity", "0");
      ring.current?.style.setProperty("opacity", "0");
    };

    const tick = () => {
      lag.x += (pos.x - lag.x) * 0.16;
      lag.y += (pos.y - lag.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  if (!enabled) return null;

  const ringSize = { default: 36, link: 64, lens: 120, text: 4, drag: 84 }[mode];

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] opacity-0 mix-blend-difference"
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[width,height] duration-300"
          style={{ width: mode === "text" ? 2 : 6, height: mode === "text" ? 22 : 6 }}
        />
      </div>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[99] opacity-0 mix-blend-difference"
      >
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 font-mono text-[10px] tracking-widest text-white uppercase transition-all duration-500 ease-out-expo"
          style={{
            width: ringSize,
            height: ringSize,
            background: mode === "link" || mode === "drag" ? "rgba(255,255,255,1)" : "transparent",
            borderColor: mode === "lens" ? "rgba(255,255,255,0.35)" : undefined,
            color: mode === "link" || mode === "drag" ? "#000" : "#fff",
          }}
        >
          {label}
        </div>
      </div>
    </>
  );
}
