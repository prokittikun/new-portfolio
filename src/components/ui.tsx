"use client";

import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ScrambleText from "./fx/ScrambleText";

export function Reveal({
  children,
  delay = 0,
  y = 30,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ index, kicker, title }: { index: string; kicker: string; title: string }) {
  return (
    <div className="mb-14 flex flex-col gap-4 sm:mb-20">
      <Reveal>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-accent">{index}</span>
          <span className="h-px w-10 bg-line" />
          <span className="eyebrow">{kicker}</span>
        </div>
      </Reveal>
      <ScrambleText
        as="h2"
        text={title}
        className="font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.92] font-bold tracking-tight uppercase"
      />
    </div>
  );
}

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 40, damping: 18 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);
  useEffect(() => spring.on("change", (v) => setN(Math.round(v))), [spring]);

  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

export function Marquee({
  items,
  reverse,
  duration = 40,
  className,
}: {
  items: React.ReactNode[];
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] ${className ?? ""}`}>
      <div
        className={`flex w-max shrink-0 ${reverse ? "animate-marquee-reverse" : "animate-marquee"} hover:[animation-play-state:paused]`}
        style={{ ["--duration" as string]: `${duration}s` }}
      >
        {[...items, ...items].map((it, i) => (
          <div key={i} className="shrink-0" aria-hidden={i >= items.length}>
            {it}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Card that tilts toward the cursor with a moving glare highlight. */
export function TiltCard({
  children,
  className,
  max = 10,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const [glare, setGlare] = useState("");

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, transformStyle: "preserve-3d" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        setGlare(`radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.18), transparent 50%)`);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        setGlare("");
      }}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300" style={{ background: glare, opacity: glare ? 1 : 0 }} />
    </motion.div>
  );
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
