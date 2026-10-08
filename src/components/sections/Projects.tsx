"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DATA, type Project } from "@/data/resume";
import { Arrow, Reveal, SectionHeading, TiltCard } from "../ui";

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <TiltCard max={6} className="relative h-full rounded-[28px]">
      <Link
        href={`/projects/${p.slug}`}
        data-cursor="link"
        data-cursor-label="View"
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-ink-2/80 backdrop-blur"
        style={{ ["--accent" as string]: p.accent }}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={p.image}
            alt={`${p.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/10 to-transparent" />
          <span
            className="absolute top-4 left-4 rounded-full px-3 py-1 font-mono text-[11px] text-ink"
            style={{ background: p.accent }}
          >
            {p.dates}
          </span>
          <span className="absolute top-3 right-5 font-display text-6xl font-bold text-white/10">
            {String(i + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl font-bold sm:text-4xl">{p.title}</h3>
              <p className="mt-1 text-sm" style={{ color: p.accent }}>
                {p.tagline}
              </p>
            </div>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-[var(--accent)] group-hover:text-ink">
              <Arrow className="size-4" />
            </span>
          </div>
          <p className="line-clamp-3 text-sm leading-relaxed text-fg/65">{p.description}</p>
          <div className="mt-auto flex flex-wrap gap-1.5">
            {p.technologies.slice(0, 6).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

/** Desktop: vertical scroll drives a horizontal track. Mobile: plain stack. */
function HorizontalTrack() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={section} className="relative hidden lg:block" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex gap-8 pr-[10vw] pl-[max(3rem,calc((100vw-1400px)/2+3rem))]">
          <div className="flex w-[26vw] shrink-0 flex-col justify-center gap-6">
            <p className="text-lg leading-relaxed text-fg/70">
              From coursework to production: university platforms, game economies, construction ERPs and queue-driven services.
            </p>
            <p className="font-mono text-xs text-muted">Keep scrolling →</p>
          </div>
          {DATA.projects.map((p, i) => (
            <div key={p.slug} className="h-[68vh] w-[min(46vw,640px)] shrink-0">
              <ProjectCard p={p} i={i} />
            </div>
          ))}
        </motion.div>
        <div className="container-x mt-10">
          <div className="h-px w-full bg-line">
            <motion.div className="h-px bg-accent" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative pt-28 sm:pt-40">
      <div className="container-x">
        <SectionHeading index="03" kicker="Selected projects" title="Things I Made" />
      </div>
      <HorizontalTrack />
      <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-6 pb-10 sm:grid-cols-2 lg:hidden">
        {DATA.projects.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.08}>
            <ProjectCard p={p} i={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
