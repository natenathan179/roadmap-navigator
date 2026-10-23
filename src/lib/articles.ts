/**
 * Long-form SEO articles that ship with the site (src/content/articles) and render
 * on the server, alongside the shorter guides staff publish from /admin.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "callout"; title: string; text: string }
  /** A live strip of matching units from inventory. */
  | {
      type: "inventory";
      title: string;
      rvClass?: string;
      condition?: "new" | "used";
      limit?: number;
    };

export type Article = {
  slug: string;
  /** H1 on the page. */
  title: string;
  /** <title> tag, ideally under ~60 characters. */
  metaTitle: string;
  /** Meta description, ideally 140–160 characters. */
  metaDescription: string;
  excerpt: string;
  category: string;
  cover: string;
  coverAlt: string;
  publishedAt: string;
  updatedAt: string;
  keyTakeaways: string[];
  blocks: ArticleBlock[];
  faqs: { q: string; a: string }[];
  /** Slugs of related guides, static or from the database. */
  related: string[];
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[*[\]()]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const plain = (text: string) => text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*/g, "");

export function readMinutes(blocks: ArticleBlock[], extra: string[] = []) {
  const words = [
    ...blocks.flatMap((b) => {
      if (b.type === "ul" || b.type === "ol") return b.items;
      if (b.type === "table") return [...b.head, ...b.rows.flat()];
      if (b.type === "callout") return [b.title, b.text];
      if (b.type === "inventory") return [];
      return [b.text];
    }),
    ...extra,
  ]
    .map(plain)
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

/** Converts the light markdown staff write in /admin (##, ###, - lists, 1. lists) into blocks. */
export function markdownToBlocks(body: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    if (list) blocks.push(list);
    para = [];
    list = null;
  };

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) {
      flush();
    } else if (line.startsWith("### ")) {
      flush();
      blocks.push({ type: "h3", text: line.slice(4) });
    } else if (line.startsWith("## ") || line.startsWith("# ")) {
      flush();
      blocks.push({ type: "h2", text: line.replace(/^#+\s/, "") });
    } else if (/^[-*•]\s/.test(line) || /^\d+[.)]\s/.test(line)) {
      const type = /^\d/.test(line) ? "ol" : "ul";
      if (para.length || (list && list.type !== type)) flush();
      list ??= { type, items: [] };
      list.items.push(line.replace(/^([-*•]|\d+[.)])\s+/, ""));
    } else {
      if (list) flush();
      para.push(line);
    }
  }
  flush();
  return blocks;
}
