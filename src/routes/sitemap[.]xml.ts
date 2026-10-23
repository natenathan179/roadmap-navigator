import { createFileRoute } from "@tanstack/react-router";

import { ARTICLES } from "@/content/articles";
import { absoluteUrl } from "@/lib/dealership";
import { fetchPosts, fetchRvs } from "@/lib/inventory";

const PAGES = [
  "/",
  "/inventory",
  "/new-rvs",
  "/used-rvs",
  "/financing",
  "/trade-in",
  "/delivery",
  "/services",
  "/reviews",
  "/guides",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

type Entry = { path: string; lastmod?: string };

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: Entry[] = [
          ...PAGES.map((path) => ({ path })),
          ...ARTICLES.map((a) => ({ path: `/guides/${a.slug}`, lastmod: a.updatedAt })),
        ];

        // Database content is best-effort: if Supabase is unreachable the static pages still go out.
        const [posts, rvs] = await Promise.all([
          fetchPosts().catch(() => []),
          fetchRvs().catch(() => []),
        ]);
        for (const post of posts) {
          if (!ARTICLES.some((a) => a.slug === post.slug)) {
            entries.push({ path: `/guides/${post.slug}`, lastmod: post.published_at });
          }
        }
        for (const rv of rvs) {
          if (rv.status !== "sold")
            entries.push({ path: `/inventory/${rv.slug}`, lastmod: rv.created_at });
        }

        const body = entries
          .map(({ path, lastmod }) => {
            const loc = `<loc>${escapeXml(absoluteUrl(path))}</loc>`;
            return `  <url>${loc}${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ""}</url>`;
          })
          .join("\n");

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
          {
            headers: {
              "Content-Type": "application/xml; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          },
        );
      },
    },
  },
});
