"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DATA, SECTIONS } from "@/data/resume";
import { triggerHyperdrive } from "@/lib/scene-state";
import { scrollToId, useLenis } from "./SmoothScroll";

type Line = { kind: "in" | "out" | "err" | "accent"; text: string };

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

const BANNER = [
  "╭───────────────────────────────────────╮",
  "│   kittikun.dev  ·  portfolio          │",
  "│   type `help` · tab to autocomplete   │",
  "╰───────────────────────────────────────╯",
].join("\n");

const HELP = [
  "whoami          who is this guy",
  "about           short bio",
  "work            experience timeline",
  "projects        list projects  ·  open <slug>",
  "skills          the stack",
  "awards          competitions & hackathons",
  "contact         ways to reach me",
  "goto <section>  scroll to a section",
  "hyperdrive      ↑↑↓↓←→←→BA also works",
  "clear / exit",
];

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const router = useRouter();

  const print = useCallback((...ls: Line[]) => setLines((prev) => [...prev, ...ls]), []);
  const out = (text: string): Line => ({ kind: "out", text });

  useEffect(() => {
    if (lines.length === 0) {
      setLines([
        { kind: "accent", text: BANNER },
      ]);
    }
  }, [lines.length]);

  // Global shortcuts: ` or ⌘K toggles, Esc closes, Konami triggers hyperdrive.
  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input,textarea,[contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "`" && !typing)) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") setOpen(false);
      if (typing) return;
      seq = [...seq, e.key].slice(-KONAMI.length);
      if (seq.join(",").toLowerCase() === KONAMI.join(",").toLowerCase()) {
        seq = [];
        triggerHyperdrive();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("kittikun:terminal", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("kittikun:terminal", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      lenis?.stop();
      setTimeout(() => input.current?.focus(), 50);
    } else {
      lenis?.start();
    }
  }, [open, lenis]);

  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [lines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    print({ kind: "in", text: cmd });
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 50));
    setHIndex(-1);
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args.join(" ").toLowerCase();

    switch (name.toLowerCase()) {
      case "help":
        print(...HELP.map(out));
        break;
      case "whoami":
        print(out(`${DATA.name} — ${DATA.role} @ ${DATA.work[0].short}`), out(`📍 ${DATA.location}`), out(`"${DATA.motto}"`));
        break;
      case "about":
        print(...[DATA.summary, ...DATA.about].map(out));
        break;
      case "work":
      case "experience":
        print(...DATA.work.map((w) => out(`${w.start.padEnd(9)}→ ${w.end.padEnd(9)} ${w.title} · ${w.short} (${w.badge})`)));
        break;
      case "projects":
      case "ls":
        print(...DATA.projects.map((p) => out(`${p.slug.padEnd(18)} ${p.title} — ${p.tagline}`)), out("→ open <slug> to view one"));
        break;
      case "open":
      case "cat": {
        const p = DATA.projects.find((x) => x.slug === arg || x.title.toLowerCase() === arg);
        if (!p) {
          print({ kind: "err", text: `no such project: ${arg || "(empty)"}` });
          break;
        }
        print({ kind: "accent", text: `opening ${p.title}…` });
        setOpen(false);
        router.push(`/projects/${p.slug}`);
        break;
      }
      case "skills":
      case "stack":
        print(...Object.entries(DATA.skills).map(([k, v]) => out(`${k.padEnd(12)} ${v.join(", ")}`)));
        break;
      case "awards":
        print(...DATA.competitions.map((c) => out(`${c.dates.padEnd(9)} ${c.result.padEnd(24)} ${c.title}`)));
        break;
      case "contact":
      case "socials":
        print(out(`email     ${DATA.contact.email}`), ...DATA.contact.social.map((s) => out(`${s.name.toLowerCase().padEnd(9)} ${s.url}`)));
        break;
      case "goto":
      case "cd": {
        const s = SECTIONS.find((x) => x.id === arg || x.label.toLowerCase() === arg);
        if (!s) {
          print({ kind: "err", text: `sections: ${SECTIONS.map((x) => x.id).join(", ")}` });
          break;
        }
        setOpen(false);
        if (window.location.pathname !== "/") router.push(`/#${s.id}`);
        else setTimeout(() => scrollToId(lenis, s.id), 150);
        break;
      }
      case "hyperdrive":
        print({ kind: "accent", text: "⚡ engaging hyperdrive…" });
        triggerHyperdrive();
        setTimeout(() => setOpen(false), 400);
        break;
      case "date":
        print(out(new Date().toLocaleString("en-GB", { timeZone: DATA.timezone }) + " (Bangkok)"));
        break;
      case "sudo":
        print({ kind: "err", text: "nice try. this incident will be reported 🙃" });
        break;
      case "rm":
        print({ kind: "err", text: "rm: permission denied — tomorrow must be better than today" });
        break;
      case "echo":
        print(out(args.join(" ")));
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
      case "quit":
        setOpen(false);
        break;
      default:
        print({ kind: "err", text: `command not found: ${name}. try \`help\`` });
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const i = Math.min(history.length - 1, hIndex + 1);
      if (history[i]) {
        setHIndex(i);
        setValue(history[i]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIndex - 1;
      setHIndex(Math.max(-1, i));
      setValue(i >= 0 ? history[i] : "");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const all = ["help", "whoami", "about", "work", "projects", "skills", "awards", "contact", "goto", "open", "hyperdrive", "clear", "exit"];
      const [head, ...rest] = value.split(" ");
      if (rest.length === 0) {
        const m = all.find((c) => c.startsWith(head));
        if (m) setValue(m + " ");
      } else if (head === "open") {
        const m = DATA.projects.find((p) => p.slug.startsWith(rest.join(" ")));
        if (m) setValue(`open ${m.slug}`);
      } else if (head === "goto") {
        const m = SECTIONS.find((s) => s.id.startsWith(rest.join(" ")));
        if (m) setValue(`goto ${m.id}`);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-label="Terminal"
            className="glass flex h-[70vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl shadow-2xl shadow-accent/10"
            initial={{ y: 40, scale: 0.97, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 30, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(e) => {
              e.stopPropagation();
              input.current?.focus();
            }}
          >
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <button aria-label="Close terminal" onClick={() => setOpen(false)} className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-muted">guest@kittikun.dev — zsh</span>
              <span className="ml-auto font-mono text-[10px] text-muted">esc to close</span>
            </div>
            <div ref={body} className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed">
              {lines.map((l, i) => (
                <pre
                  key={i}
                  className={
                    "break-words whitespace-pre-wrap " +
                    (l.kind === "in"
                      ? "text-fg"
                      : l.kind === "err"
                        ? "text-red-400"
                        : l.kind === "accent"
                          ? "text-accent"
                          : "text-fg/65")
                  }
                >
                  {l.kind === "in" ? <span className="text-accent">❯ </span> : null}
                  {l.text}
                </pre>
              ))}
              <div className="flex items-center">
                <span className="text-accent">❯&nbsp;</span>
                <input
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Terminal input"
                  className="flex-1 bg-transparent text-fg caret-accent outline-none"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function openTerminal() {
  window.dispatchEvent(new CustomEvent("kittikun:terminal"));
}
