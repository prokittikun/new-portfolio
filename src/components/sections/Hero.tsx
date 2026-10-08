"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { DATA } from "@/data/resume";
import { useReady } from "@/lib/ready";
import Magnetic from "../fx/Magnetic";
import { scrollToId, useLenis } from "../fx/SmoothScroll";
import { openTerminal } from "../fx/Terminal";

const ease = [0.16, 1, 0.3, 1] as const;

function SplitWord({ word, delay, outline }: { word: string; delay: number; outline?: boolean }) {
  const ready = useReady();
  return (
    <span className="flex overflow-hidden" aria-hidden>
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          className={`inline-block ${outline ? "text-outline" : ""}`}
          initial={{ y: "110%", rotate: 8 }}
          animate={ready ? { y: "0%", rotate: 0 } : undefined}
          transition={{ duration: 1.1, delay: delay + i * 0.045, ease }}
          whileHover={{ y: "-12%", color: "#ff5f1f", transition: { duration: 0.2 } }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function RotatingBadge() {
  return (
    <div className="relative size-28 sm:size-32">
      <motion.svg viewBox="0 0 100 100" className="size-full" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
        <defs>
          <path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-fg/70 font-mono text-[7.5px] tracking-[0.18em] uppercase">
          <textPath href="#circle">Scroll · Explore · Scroll · Explore ·</textPath>
        </text>
      </motion.svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-accent">
          ↓
        </motion.span>
      </span>
    </div>
  );
}

export default function Hero() {
  const ready = useReady();
  const lenis = useLenis();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay, ease },
  });

  return (
    <section id="home" ref={ref} className="relative flex min-h-dvh flex-col justify-end overflow-hidden pt-28 pb-10">
      <motion.div style={{ y, opacity }} className="container-x relative">
        <motion.div {...fade(0.2)} className="mb-6 flex flex-wrap items-center gap-3">
          <span className="chip gap-2">
            <span className="size-1.5 rounded-full bg-accent" /> {DATA.role} @ {DATA.work[0].short}
          </span>
          <span className="chip">📍 {DATA.location}</span>
        </motion.div>

        <h1 className="@container font-display leading-[0.82] font-extrabold tracking-[-0.04em] uppercase select-none">
          <span className="sr-only">{DATA.name}</span>
          <span className="block text-[min(9.9cqw,12.5rem)]">
            <SplitWord word={DATA.firstName} delay={0.1} />
          </span>
          <span className="block sm:pl-[2cqw] text-[min(9.9cqw,12.5rem)]">
            <SplitWord word={DATA.lastName} delay={0.3} outline />
          </span>
        </h1>

        <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div className="max-w-xl">
            <motion.p {...fade(0.9)} className="text-lg leading-relaxed text-fg/80 sm:text-xl">
              A curious engineer who <span className="text-fg">learns by building</span>. I love turning messy problems into{" "}
              <span className="text-fg">simple things people enjoy using</span>, and I keep pushing a little{" "}
              <span className="text-fg">past what I already know</span>.
            </motion.p>
            <motion.p {...fade(1.05)} className="mt-4 font-mono text-xs text-muted">
              “{DATA.motto}”
            </motion.p>
            <motion.div {...fade(1.2)} className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <button
                  onClick={() => scrollToId(lenis, "projects")}
                  className="group relative overflow-hidden rounded-full bg-fg px-6 py-3 text-sm font-medium text-ink"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-accent transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                  <span className="relative">View my work</span>
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => scrollToId(lenis, "contact")}
                  className="rounded-full border border-line px-6 py-3 text-sm text-fg/90 backdrop-blur transition-colors hover:border-accent hover:text-accent"
                >
                  Get in touch
                </button>
              </Magnetic>
              <button onClick={openTerminal} className="font-mono text-xs text-muted transition-colors hover:text-accent">
                or press <kbd className="rounded border border-line px-1.5 py-0.5">`</kbd> for a terminal
              </button>
            </motion.div>
          </div>
          <motion.div {...fade(1.4)} className="hidden justify-self-end lg:block">
            <button onClick={() => scrollToId(lenis, "about")} aria-label="Scroll to about">
              <RotatingBadge />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
