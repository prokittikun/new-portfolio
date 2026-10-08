"use client";

import Image from "next/image";
import { motion, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { DATA, type Work as WorkT } from "@/data/resume";
import { Arrow, Reveal, SectionHeading } from "../ui";

const HIGHLIGHT = /(\d+%|\d+\+ concurrent users|OWASP Top 10|AI customer support agent|Kubernetes liveness probes)/g;

function Highlighted({ text }: { text: string }) {
  return (
    <>
      {text.split(HIGHLIGHT).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-medium text-accent-2">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

function Job({ job, index }: { job: WorkT; index: number }) {
  const [open, setOpen] = useState(index < 2);
  const current = job.end === "Present";
  const preview = open ? job.bullets : job.bullets.slice(0, 1);

  return (
    <Reveal>
      <article className="group relative grid gap-6 border-t border-line py-10 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-10">
        {/* timeline node */}
        <span className="absolute top-0 -left-[29.5px] hidden size-[11px] -translate-y-1/2 rounded-full border-2 border-ink bg-fg/40 transition-colors group-hover:bg-accent md:block lg:-left-[45.5px]" />

        <div className="md:sticky md:top-28 md:self-start">
          <div className="flex items-center gap-4">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-line bg-white">
              <Image src={job.logoUrl} alt="" fill sizes="48px" className="object-contain" />
            </span>
            <div>
              <a href={job.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium hover:text-accent">
                {job.short} <Arrow className="size-3.5" />
              </a>
              <p className="font-mono text-[11px] text-muted">
                {job.start} — {job.end}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className={`chip ${current ? "border-accent/40 text-accent" : ""}`}>
              {current && <span className="mr-1.5 size-1.5 animate-pulse rounded-full bg-accent" />}
              {job.badge}
            </span>
            <span className="chip">{job.location}</span>
          </div>
        </div>

        <div className="rounded-3xl border border-line bg-ink/75 p-6 backdrop-blur-xl sm:p-8">
          <h3 className="font-display text-2xl font-bold sm:text-3xl">{job.title}</h3>
          <p className="mt-1 text-sm text-muted">{job.company}</p>
          <ul className="mt-6 space-y-4">
            {preview.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex gap-4 leading-relaxed text-fg/75"
              >
                <span className="mt-2.5 h-px w-4 shrink-0 bg-accent/70" />
                <span>
                  <Highlighted text={b} />
                </span>
              </motion.li>
            ))}
          </ul>
          {job.bullets.length > 1 && (
            <button onClick={() => setOpen((o) => !o)} className="mt-5 font-mono text-xs text-muted hover:text-accent">
              {open ? "− show less" : `+ ${job.bullets.length - 1} more`}
            </button>
          )}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {job.stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Work() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });

  return (
    <section id="work" className="relative py-28 sm:py-40">
      <div className="container-x">
        <SectionHeading index="02" kicker="Experience" title="Where I've Built" />
        <div ref={ref} className="relative md:pl-6 lg:pl-10">
          <div className="absolute top-0 bottom-0 left-0 hidden w-px bg-line md:block">
            <motion.div className="w-px origin-top bg-gradient-to-b from-accent to-accent-2" style={{ scaleY: scrollYProgress, height: "100%" }} />
          </div>
          {DATA.work.map((job, i) => (
            <Job key={`${job.short}-${job.start}`} job={job} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
