import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import ScrambleText from "@/components/fx/ScrambleText";
import { Arrow, Reveal } from "@/components/ui";
import { DATA } from "@/data/resume";
import { getProjectImages } from "@/lib/content";
import { fitTitle } from "@/lib/fit-title";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DATA.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = DATA.projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    openGraph: { title: p.title, description: p.description, images: [p.image] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const idx = DATA.projects.findIndex((x) => x.slug === slug);
  if (idx === -1) notFound();
  const p = DATA.projects[idx];
  const next = DATA.projects[(idx + 1) % DATA.projects.length];
  const images = getProjectImages(slug);

  return (
    <main className="pt-32 pb-10 sm:pt-40" style={{ ["--accent" as string]: p.accent }}>
      <div className="container-x">
        <Reveal>
          <Link href="/#projects" className="font-mono text-xs text-muted transition-colors hover:text-accent">
            ← All projects
          </Link>
        </Reveal>

        <div className="@container mt-10 flex flex-col gap-6">
          <Reveal>
            <span className="chip" style={{ borderColor: `${p.accent}55`, color: p.accent }}>
              {p.dates}
            </span>
          </Reveal>
          <ScrambleText
            as="h1"
            text={p.title}
            style={{ fontSize: fitTitle(p.title, 9) }}
            className="font-display leading-[0.9] font-extrabold tracking-tight uppercase"
          />
          <Reveal delay={0.1}>
            <p className="text-xl" style={{ color: p.accent }}>
              {p.tagline}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
          <Reveal>
            <p className="text-lg leading-relaxed text-fg/75 sm:text-xl">{p.description}</p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-8">
            <div>
              <p className="eyebrow mb-3">Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {p.technologies.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            {p.links.length > 0 && (
              <div>
                <p className="eyebrow mb-3">Links</p>
                <ul className="flex flex-col">
                  {p.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between border-b border-line py-3 transition-colors hover:text-[var(--accent)]"
                      >
                        {l.label}
                        <Arrow className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-line">
            <Image src={p.image} alt={`${p.title} cover`} fill priority sizes="100vw" className="object-cover object-top" />
          </div>
        </Reveal>

        {images.length > 0 && (
          <section className="mt-24">
            <div className="mb-8 flex items-baseline justify-between">
              <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">Gallery</h2>
              <span className="font-mono text-xs text-muted">{images.length} shots</span>
            </div>
            <Gallery images={images} title={p.title} />
          </section>
        )}

        <Link
          href={`/projects/${next.slug}`}
          className="group mt-32 flex flex-col gap-3 border-t border-line pt-10"
          data-cursor="link"
          data-cursor-label="Next"
        >
          <span className="eyebrow">Next project</span>
          <span className="flex items-center justify-between gap-6">
            <span className="@container min-w-0 flex-1">
              <span
                className="block font-display leading-none font-extrabold uppercase transition-colors duration-500 group-hover:text-[var(--next)]"
                style={{ ["--next" as string]: next.accent, fontSize: fitTitle(next.title, 7) }}
              >
                {next.title}
              </span>
            </span>
            <Arrow className="size-12 shrink-0 transition-transform duration-700 group-hover:rotate-45 sm:size-20" />
          </span>
        </Link>
      </div>
    </main>
  );
}
