"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { DATA } from "@/data/resume";
import { triggerHyperdrive } from "@/lib/scene-state";
import Magnetic from "../fx/Magnetic";
import ScrambleText from "../fx/ScrambleText";
import { scrollToId, useLenis } from "../fx/SmoothScroll";
import { Arrow, Reveal } from "../ui";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-12%", "0%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["12%", "0%"]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(DATA.contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${DATA.contact.email}`;
    }
  };

  return (
    <section id="contact" ref={ref} className="relative flex min-h-dvh flex-col justify-between overflow-hidden pt-28 sm:pt-40">
      <div className="container-x">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-accent">07</span>
            <span className="h-px w-10 bg-line" />
            <span className="eyebrow">What&apos;s next?</span>
          </div>
        </Reveal>

        <h2 className="@container mt-8 font-display leading-[0.85] font-extrabold tracking-[-0.04em] uppercase">
          <motion.span style={{ x: x1 }} className="block text-[min(8.6cqw,10rem)] whitespace-nowrap">
            Let&apos;s build
          </motion.span>
          <motion.span style={{ x: x2 }} className="block text-[min(8.6cqw,10rem)] whitespace-nowrap text-accent">
            tomorrow<span className="text-fg">.</span>
          </motion.span>
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="max-w-lg text-lg text-fg/70">
              Open to interesting problems, collaborations and a good chat about AI agents, systems or Three.js. My inbox is always open.
            </p>
            <div className="relative mt-8 inline-block">
              <Magnetic strength={0.25}>
                <button
                  onClick={copy}
                  data-cursor="link"
                  data-cursor-label={copied ? "✓" : "Copy"}
                  className="group flex items-center gap-3 rounded-full border border-line bg-ink-2/70 py-2.5 pr-2.5 pl-5 sm:gap-4 sm:py-3 sm:pr-3 sm:pl-6 backdrop-blur transition-colors hover:border-accent"
                >
                  <span className="font-display text-[15px] font-semibold sm:text-2xl">{DATA.contact.email}</span>
                  <span className="flex size-11 items-center justify-center rounded-full bg-accent text-ink transition-transform duration-500 group-hover:rotate-45">
                    <Arrow className="size-5" />
                  </span>
                </button>
              </Magnetic>
              <AnimatePresence>
                {copied && (
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute -top-8 left-6 font-mono text-xs text-acid"
                  >
                    copied to clipboard ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <ul className="flex flex-col gap-1">
            {DATA.contact.social.map((s) => (
              <li key={s.name}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-10 border-b border-line py-3 text-lg"
                >
                  <ScrambleText text={s.name} className="transition-colors group-hover:text-accent" />
                  <Arrow className="size-4 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="container-x mt-24 flex flex-col gap-4 border-t border-line py-8 font-mono text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {DATA.name} — Making tomorrow better than today, one commit at a time.</span>
        <button onClick={() => triggerHyperdrive()} className="text-left transition-colors hover:text-acid">
          psst… try ↑↑↓↓←→←→BA
        </button>
        <button onClick={() => scrollToId(lenis, "home")} className="text-left transition-colors hover:text-accent">
          Back to top ↑
        </button>
      </footer>
    </section>
  );
}
