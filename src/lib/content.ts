import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export type PostMeta = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

const BLOG_DIR = path.join(process.cwd(), "content");

async function markdownToHTML(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, { theme: "vesper", keepBackground: true })
    .use(rehypeStringify)
    .process(markdown);
  return file.toString();
}

export function getPostSlugs() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export function getPostsMeta() {
  return getPostSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf-8");
      return { slug, meta: matter(raw).data as PostMeta };
    })
    .sort((a, b) => (a.meta.publishedAt < b.meta.publishedAt ? 1 : -1));
}

export async function getPost(slug: string) {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { content, data } = matter(fs.readFileSync(file, "utf-8"));
  return { slug, meta: data as PostMeta, html: await markdownToHTML(content) };
}

export function getProjectImages(slug: string) {
  const dir = path.join(process.cwd(), "public", "projects", slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|gif|webp)$/i.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((f) => `/projects/${slug}/${f}`);
}

export function readingTime(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  // Thai has no word spaces, so estimate from characters instead of words.
  return Math.max(1, Math.round(text.length / 900));
}
