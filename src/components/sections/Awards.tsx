"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "motion/react";
import { useState } from "react";
import { DATA } from "@/data/resume";
import { SectionHeading } from "../ui";

/** Award list with an image preview that trails the cursor on hover. */
export default function Awards() {
  const [hover, setHover] = useState<number | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 22 });
  const y = useSpring(my, { stiffness: 180, damping: 22 });
  const rotate = useSpring(useTransform(useVelocity(mx), [-2500, 2500], [-14, 14], { clamp: true }), {
    stiffness: 120,
    damping: 14,
  });

  return (
    <section id="awards" className="relative py-28 sm:py-40">
      <div className="container-x">
        <SectionHeading index="05" kicker="Competitions & hackathons" title="Battle Log" />

        <ul
          className="rounded-3xl border border-line bg-ink/75 px-5 backdrop-blur-xl sm:px-8 [&>li:last-child]:border-b-0"
          onPointerMove={(e) => {
            mx.set(e.clientX);
            my.set(e.clientY);
          }}
          onPointerLeave={() => setHover(null)}
        >
          {DATA.competitions.map((c, i) => (
            <motion.li
                key={c.title + c.dates}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.8, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setHover(i);
                }}
                className="group relative grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-b border-line py-7 transition-colors md:grid-cols-[110px_1fr_auto] md:py-9"
              >
                <span className="font-mono text-xs text-muted">{c.dates}</span>
                <div>
                  <h3 className="font-display text-xl font-bold transition-transform duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-accent sm:text-3xl">
                    {c.title}
                  </h3>
                  <div className="grid transition-[grid-template-rows] duration-500 ease-out-expo md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]">
                    <p className="overflow-hidden text-sm leading-relaxed text-fg/60 md:translate-x-3">
                      <span className="block max-w-2xl pt-2">{c.description}</span>
                    </p>
                  </div>
                </div>
                <div className="col-span-2 flex flex-wrap items-center gap-2 md:col-span-1 md:justify-end">
                  <span className="chip border-accent/30 text-accent-2">{c.result}</span>
                  <span className="chip">{c.location}</span>
                </div>
              </motion.li>
          ))}
        </ul>
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block"
        style={{ x, y, rotate }}
      >
        <AnimatePresence>
          {hover !== null && (
            <motion.div
              key="preview"
              className="relative -mt-[110px] ml-8 h-[220px] w-[320px] overflow-hidden rounded-2xl border border-line shadow-2xl shadow-black/60"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={hover}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ clipPath: "inset(0% 0 0 0)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={DATA.competitions[hover].image} alt="" fill sizes="320px" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
