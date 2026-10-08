import type { MetadataRoute } from "next";
import { DATA } from "@/data/resume";
import { getPostsMeta } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: DATA.url, lastModified: now, priority: 1 },
    { url: `${DATA.url}/blog`, lastModified: now, priority: 0.7 },
    ...DATA.projects.map((p) => ({ url: `${DATA.url}/projects/${p.slug}`, lastModified: now, priority: 0.8 })),
    ...getPostsMeta().map((p) => ({ url: `${DATA.url}/blog/${p.slug}`, lastModified: new Date(p.meta.publishedAt), priority: 0.6 })),
  ];
}
