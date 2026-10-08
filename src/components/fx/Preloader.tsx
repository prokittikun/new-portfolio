"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { setReady } from "@/lib/ready";
import { useLenis } from "./SmoothScroll";

const WORDS = ["สวัสดี", "Hello", "こんにちは", "Hola", "Bonjour", "안녕하세요", "Kittikun"];

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (sessionStorage.getItem("kb-loaded")) {
      setSkip(true);
      setDone(true);
      return;
    }
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setDone(true);
          sessionStorage.setItem("kb-loaded", "1");
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (done) setReady();
  }, [done]);

  useEffect(() => {
    if (!lenis) return;
    if (done) lenis.start();
    else lenis.stop();
  }, [done, lenis]);

  if (skip) return null;

  const word = WORDS[Math.min(WORDS.length - 1, Math.floor((count / 100) * WORDS.length))];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[90] flex flex-col justify-between bg-ink p-6 sm:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow">Kittikun Buntoyut — Portfolio</span>
            <span className="eyebrow">©2026</span>
          </div>
          <div className="flex items-center justify-center">
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className="font-display text-4xl text-fg sm:text-6xl"
            >
              <span className="mr-3 inline-block size-2.5 -translate-y-2 rounded-full bg-accent align-middle sm:size-3" />
              {word}
            </motion.span>
          </div>
          <div className="flex items-end justify-between gap-6">
            <div className="h-px flex-1 bg-line">
              <div className="h-px bg-accent" style={{ width: `${count}%` }} />
            </div>
            <span className="font-display text-7xl leading-none tabular-nums sm:text-[10rem]">
              {String(count).padStart(3, "0")}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
