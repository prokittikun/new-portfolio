import type { Metadata } from "next";
import Link from "next/link";
import ScrambleText from "@/components/fx/ScrambleText";
import { Arrow, Reveal } from "@/components/ui";
import { getPostsMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on backend, infrastructure and things I learned along the way.",
};

export default function BlogIndex() {
  const posts = getPostsMeta();
  return (
    <main className="pt-32 pb-24 sm:pt-40">
      <div className="container-x">
        <ScrambleText
          as="h1"
          text="Writing"
          className="font-display text-[clamp(3rem,12vw,10rem)] leading-[0.9] font-extrabold tracking-tight uppercase"
        />
        <Reveal>
          <p className="mt-6 max-w-xl text-lg text-fg/70">Notes on backend, infrastructure and things I learned along the way (in Thai).</p>
        </Reveal>
        <div className="mt-16 border-t border-line">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <Link href={`/blog/${p.slug}`} className="group grid gap-3 border-b border-line py-8 sm:grid-cols-[140px_1fr_auto] sm:items-center">
                <span className="font-mono text-xs text-muted">
                  {new Date(p.meta.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span className="text-xl font-semibold transition-all duration-500 group-hover:translate-x-2 group-hover:text-accent sm:text-2xl">
                  {p.meta.title}
                </span>
                <Arrow className="hidden size-6 transition-transform duration-500 group-hover:rotate-45 sm:block" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
