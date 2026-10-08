"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DATA, SECTIONS } from "@/data/resume";
import { HYPER_EVENT } from "@/lib/scene-state";
import { scrollToId, useLenis } from "./fx/SmoothScroll";
import { openTerminal } from "./fx/Terminal";

function useBangkokTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: DATA.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState("home");
  useEffect(() => {
    if (!enabled) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
  return active;
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const home = pathname === "/";
  const active = useActiveSection(home);
  const time = useBangkokTime();
  const lenis = useLenis();
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hyper, setHyper] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setHidden(y > 200 && y > last);
      last = y;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const on = () => {
      setHyper(true);
      clearTimeout(t);
      t = setTimeout(() => setHyper(false), 3200);
    };
    window.addEventListener(HYPER_EVENT, on);
    return () => window.removeEventListener(HYPER_EVENT, on);
  }, []);

  useEffect(() => {
    if (menu) lenis?.stop();
    else lenis?.start();
  }, [menu, lenis]);

  const go = (id: string) => {
    setMenu(false);
    if (home) scrollToId(lenis, id);
    else router.push(`/#${id}`);
  };

  // Arriving on "/" with a hash from a sub-page.
  useEffect(() => {
    if (!home || !window.location.hash) return;
    const id = window.location.hash.slice(1);
    const t = setTimeout(() => scrollToId(lenis, id), 400);
    return () => clearTimeout(t);
  }, [home, lenis]);

  return (
    <>
      <motion.div className="fixed top-0 right-0 left-0 z-[70] h-[2px] origin-left bg-accent" style={{ scaleX: progress }} />

      <motion.header
        className="fixed top-0 right-0 left-0 z-[65]"
        animate={{ y: hidden && !menu ? -100 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-x flex items-center justify-between py-4">
          <Link href="/" onClick={(e) => { if (home) { e.preventDefault(); go("home"); } }} className="group flex items-center gap-3" aria-label="Home">
            <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-full border border-line bg-ink-2 font-display text-sm font-bold">
              <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-8">KB</span>
              <span className="absolute translate-y-8 text-accent transition-transform duration-500 ease-out-expo group-hover:translate-y-0">:)</span>
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-medium">{DATA.name}</span>
              <span className="font-mono text-[10px] text-muted">{DATA.role}</span>
            </span>
          </Link>

          <nav className="glass hidden items-center gap-1 rounded-full p-1 lg:flex" aria-label="Sections">
            {SECTIONS.slice(1).map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className="relative rounded-full px-3.5 py-1.5 text-[13px] text-fg/70 transition-colors hover:text-fg"
              >
                {home && active === s.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative">{s.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 font-mono text-[11px] text-muted md:flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              BKK {time}
            </span>
            <button
              onClick={openTerminal}
              className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[11px] text-fg/80 transition-colors hover:text-accent"
              data-cursor-label=">_"
              aria-label="Open terminal"
            >
              <span>&gt;_</span>
              <kbd className="hidden text-muted sm:inline">⌘K</kbd>
            </button>
            <button
              onClick={() => setMenu((m) => !m)}
              className="glass flex size-9 flex-col items-center justify-center gap-1.5 rounded-full lg:hidden"
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
            >
              <span className={`h-px w-4 bg-fg transition-transform ${menu ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-4 bg-fg transition-transform ${menu ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col justify-end bg-ink/95 px-6 pb-12 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-1">
              {SECTIONS.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button onClick={() => go(s.id)} className="flex items-baseline gap-4 font-display text-5xl font-bold">
                    <span className="font-mono text-xs text-accent">0{i}</span>
                    {s.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-4 font-mono text-xs text-muted">
              {DATA.contact.social.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                  {s.name} ↗
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hyper && (
          <motion.div
            className="pointer-events-none fixed inset-x-0 bottom-10 z-[75] flex justify-center"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
          >
            <div className="rounded-full border border-acid/40 bg-ink/80 px-5 py-2 font-mono text-xs tracking-widest text-acid uppercase backdrop-blur">
              ⚡ Hyperdrive engaged
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
