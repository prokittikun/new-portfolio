import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui";
import { getPost, getPostSlugs, readingTime } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.summary,
    openGraph: { title: post.meta.title, description: post.meta.summary, images: post.meta.image ? [post.meta.image] : [] },
  };
}

export default async function BlogPost({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="pt-32 pb-24 sm:pt-40">
      <article className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <Link href="/blog" className="font-mono text-xs text-muted transition-colors hover:text-accent">
            ← All writing
          </Link>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-8 text-3xl leading-tight font-semibold sm:text-5xl">{post.meta.title}</h1>
          <p className="mt-4 font-mono text-xs text-muted">
            {new Date(post.meta.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
            {readingTime(post.html)} min read
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div
            className="prose prose-invert mt-12 max-w-none rounded-3xl border border-line bg-ink/85 p-6 backdrop-blur-xl prose-headings:font-semibold prose-a:text-accent prose-blockquote:border-accent/60 prose-strong:text-fg sm:p-10"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </Reveal>
      </article>
    </main>
  );
}
