"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, MotionValue, useScroll, useTransform } from "motion/react";
import { Fragment, useRef } from "react";
import { DATA } from "@/data/resume";
import { Counter, Reveal, SectionHeading } from "../ui";

const DistortImage = dynamic(() => import("../canvas/DistortImage"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-ink-3" />,
});

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}

function ScrollParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="font-display text-[clamp(1.5rem,2.8vw,2.6rem)] leading-[1.15] font-semibold tracking-tight">
      {words.map((w, i) => {
        const start = i / words.length;
        return (
          // Real space characters (not margins) so copy/paste and screen readers get proper words.
          <Fragment key={i}>
            <Word progress={scrollYProgress} range={[start, start + 1 / words.length]}>
              {w}
            </Word>{" "}
          </Fragment>
        );
      })}
    </p>
  );
}

export default function About() {
  const { education: edu } = DATA;
  return (
    <section id="about" className="relative py-28 sm:py-40">
      <div className="container-x">
        <SectionHeading index="01" kicker="About me" title="Hello, World" />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative">
              <DistortImage
                src={DATA.avatarUrl}
                alt={`Portrait of ${DATA.name}`}
                className="aspect-[3/4] w-full overflow-hidden rounded-3xl border border-line"
              />
              <div className="glass absolute -bottom-5 left-5 rounded-2xl px-4 py-3 sm:left-auto sm:-right-5">
                <p className="eyebrow">Hover the photo</p>
                <p className="font-mono text-xs text-accent">GLSL liquid lens ✦</p>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-14">
            <ScrollParagraph text={DATA.summary} />

            <div className="grid gap-6 text-fg/70 sm:grid-cols-2">
              {DATA.about.map((p, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <p className="leading-relaxed">{p}</p>
                </Reveal>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line">
              {DATA.stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08} className="bg-ink/80 p-6 backdrop-blur sm:p-8">
                  <p className="font-display text-5xl font-bold text-fg sm:text-6xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-muted">{s.label}</p>
                </Reveal>
              ))}
            </div>

            <Reveal>
              <a
                href={edu.href}
                target="_blank"
                rel="noreferrer"
                className="group glass flex items-center gap-5 rounded-3xl p-5 transition-colors hover:border-accent/40"
              >
                <span className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-white">
                  <Image src={edu.logoUrl} alt="" fill sizes="56px" className="object-contain p-1.5" />
                </span>
                <span className="flex-1">
                  <span className="eyebrow block">Education</span>
                  <span className="mt-1 block font-medium">{edu.school}</span>
                  <span className="block text-sm text-muted">{edu.degree}</span>
                </span>
                <span className="font-mono text-xs text-muted">
                  {edu.start} — {edu.end}
                </span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
