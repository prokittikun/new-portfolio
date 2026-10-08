"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DATA } from "@/data/resume";
import { Marquee, Reveal, SectionHeading } from "../ui";

const ALL = Object.values(DATA.skills).flat();

/**
 * DOM tag sphere: tags sit on a Fibonacci sphere and are projected each frame.
 * Drag (or flick) to spin; it drifts toward the cursor otherwise.
 */
function TagSphere({ highlight }: { highlight: string | null }) {
  const wrap = useRef<HTMLDivElement>(null);
  const tags = useRef<(HTMLSpanElement | null)[]>([]);
  const points = useMemo(() => {
    const n = ALL.length;
    const g = Math.PI * (3 - Math.sqrt(5));
    return ALL.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      return [Math.cos(g * i) * r, y, Math.sin(g * i) * r] as [number, number, number];
    });
  }, []);
  const highlightRef = useRef(highlight);
  useEffect(() => {
    highlightRef.current = highlight;
  }, [highlight]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let rotX = 0.3;
    let rotY = 0;
    let vx = 0.0015;
    let vy = 0.004;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let visible = true;

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (dragging) {
        vy = (e.clientX - lastX) * 0.0025;
        vx = -(e.clientY - lastY) * 0.0025;
        lastX = e.clientX;
        lastY = e.clientY;
      } else if (e.pointerType === "mouse") {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        vy = vy * 0.9 + dx * 0.012 * 0.1;
        vx = vx * 0.9 - dy * 0.012 * 0.1;
      }
    };
    const up = () => (dragging = false);

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (!dragging) {
        vx *= 0.985;
        vy *= 0.985;
        if (Math.abs(vy) < 0.0025) vy += 0.00006 * Math.sign(vy || 1);
      }
      rotX += vx;
      rotY += vy;
      const R = el.clientWidth * 0.4;
      const cx = Math.cos(rotX);
      const sx = Math.sin(rotX);
      const cy = Math.cos(rotY);
      const sy = Math.sin(rotY);
      const hl = highlightRef.current;
      points.forEach(([x, y, z], i) => {
        const node = tags.current[i];
        if (!node) return;
        // rotate around Y then X
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y1 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 back … 1 front
        const scale = 0.55 + depth * 0.65;
        const hot = hl ? (DATA.skills[hl] ?? []).includes(ALL[i]) : false;
        node.style.transform = `translate3d(${x1 * R}px, ${y1 * R}px, 0) translate(-50%, -50%) scale(${scale * (hot ? 1.15 : 1)})`;
        node.style.opacity = String(hl ? (hot ? 1 : 0.12) : 0.15 + depth * 0.85);
        node.style.zIndex = String(Math.round(depth * 100));
        node.style.color = hot ? "var(--color-accent)" : "";
      });
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [points]);

  return (
    <div
      ref={wrap}
      data-cursor="drag"
      data-cursor-label="Drag"
      className="relative mx-auto aspect-square w-full max-w-[560px] touch-none select-none"
    >
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(255,95,31,0.14),transparent_65%)]" />
      <div className="absolute top-1/2 left-1/2">
        {ALL.map((s, i) => (
          <span
            key={s}
            ref={(n) => {
              tags.current[i] = n;
            }}
            className="absolute top-0 left-0 font-display text-base font-semibold whitespace-nowrap text-fg will-change-transform sm:text-lg"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const cats = Object.keys(DATA.skills);

  return (
    <section id="skills" className="relative py-28 sm:py-40">
      <div className="container-x">
        <SectionHeading index="04" kicker="Toolbox" title="The Stack" />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <TagSphere highlight={active} />
          <div className="flex flex-col divide-y divide-line rounded-3xl border border-line bg-ink/75 px-6 backdrop-blur-xl sm:px-8">
            {cats.map((c, i) => (
              <Reveal key={c} delay={i * 0.06}>
                <button
                  onPointerEnter={() => setActive(c)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(c)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive((a) => (a === c ? null : c))}
                  className="group flex w-full flex-col gap-3 py-6 text-left"
                >
                  <span className="flex items-baseline justify-between">
                    <span className="font-display text-2xl font-bold transition-colors group-hover:text-accent sm:text-3xl">{c}</span>
                    <span className="font-mono text-xs text-muted">{String(DATA.skills[c].length).padStart(2, "0")}</span>
                  </span>
                  <span className="flex flex-wrap gap-1.5">
                    {DATA.skills[c].map((s) => (
                      <span key={s} className="chip transition-colors group-hover:border-accent/30">
                        {s}
                      </span>
                    ))}
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-24 flex flex-col gap-4 sm:mt-32">
        <Marquee
          duration={55}
          items={ALL.map((s) => (
            <span key={s} className="mx-6 font-display text-5xl font-bold uppercase sm:text-7xl">
              {s} <span className="text-accent">✦</span>
            </span>
          ))}
        />
        <Marquee
          reverse
          duration={65}
          items={ALL.map((s) => (
            <span key={s} className="text-outline mx-6 font-display text-5xl font-bold uppercase sm:text-7xl">
              {s} <span className="text-fg/20">✦</span>
            </span>
          ))}
        />
      </div>
    </section>
  );
}
