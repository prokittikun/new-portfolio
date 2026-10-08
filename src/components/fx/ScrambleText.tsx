"use client";

import { useInView } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// Only glyphs no wider than SCRAMBLE_MAX_EM in the display font, so a title
// sized by fitTitle can't overflow while it's scrambling (W, M, # etc. are wider).
const GLYPHS = "!<>-_\\/[]{}=+*^?ABEFIJLSTVXY0123456789";

/**
 * Decodes text from random glyphs when it scrolls into view, and again on hover.
 */
export default function ScrambleText({
  text,
  className,
  style,
  delay = 0,
  speed = 1,
  hover = true,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  speed?: number;
  hover?: boolean;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const dur = (500 + text.length * 28) / speed;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const revealed = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < revealed || ch === " ") s += ch;
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text, speed]);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(run, delay * 1000);
    return () => clearTimeout(t);
  }, [inView, delay, run]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={style}
      aria-label={text}
      onPointerEnter={hover ? run : undefined}
    >
      <span aria-hidden>{out}</span>
    </Tag>
  );
}
