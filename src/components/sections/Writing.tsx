"use client";

import Image from "next/image";
import Link from "next/link";
import { DATA } from "@/data/resume";
import type { PostMeta } from "@/lib/content";
import { Arrow, Reveal, SectionHeading, TiltCard } from "../ui";

export default function Writing({ posts }: { posts: { slug: string; meta: PostMeta }[] }) {
  const medium = DATA.contact.social.find((s) => s.name === "Medium");
  return (
    <section id="writing" className="relative py-28 sm:py-40">
      <div className="container-x">
        <SectionHeading index="06" kicker="Notes from the trenches" title="Writing" />
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.1}>
              <TiltCard max={5} className="relative rounded-[28px]">
                <Link
                  href={`/blog/${p.slug}`}
                  data-cursor="link"
                  data-cursor-label="Read"
                  className="group flex flex-col overflow-hidden rounded-[28px] border border-line bg-ink-2/80 backdrop-blur"
                >
                  {p.meta.image && (
                    <div className="relative aspect-[2/1] overflow-hidden">
                      <Image
                        src={p.meta.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-4 p-6 sm:p-8">
                    <div>
                      <p className="font-mono text-xs text-muted">
                        {new Date(p.meta.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · TH
                      </p>
                      <h3 className="mt-3 text-xl leading-snug font-semibold transition-colors group-hover:text-accent sm:text-2xl">
                        {p.meta.title}
                      </h3>
                    </div>
                    <Arrow className="mt-1 size-5 shrink-0 transition-transform duration-500 group-hover:rotate-45" />
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        {medium && (
          <Reveal className="mt-10 flex justify-center">
            <a href={medium.url} target="_blank" rel="noreferrer" className="font-mono text-xs text-muted transition-colors hover:text-accent">
              More on Medium ↗
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
