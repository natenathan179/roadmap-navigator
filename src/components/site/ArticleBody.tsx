import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

import { RvCard } from "@/components/site/RvCard";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify, type ArticleBlock } from "@/lib/articles";
import { rvsQuery } from "@/lib/inventory";

/** Renders `[label](/path?query)` links and `**bold**` inside article text. */
export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, label = "", href = "", bold] = match;
    if (bold) {
      parts.push(<strong key={match.index}>{bold}</strong>);
    } else if (href.startsWith("/")) {
      const [path, query = ""] = href.split("?");
      const search = Object.fromEntries(new URLSearchParams(query));
      parts.push(
        <Link key={match.index} to={path as never} search={search as never}>
          {label}
        </Link>,
      );
    } else {
      parts.push(
        <a key={match.index} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="article-body">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <Inline text={block.text} />
        </p>
      );
    case "h2":
      return <h2 id={slugify(block.text)}>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
    case "ol": {
      const List = block.type;
      return (
        <List>
          {block.items.map((item, i) => (
            <li key={i}>
              <Inline text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div className="article-table">
          <table>
            {block.caption ? <caption>{block.caption}</caption> : null}
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) =>
                    c === 0 ? (
                      <th key={c} scope="row">
                        <Inline text={cell} />
                      </th>
                    ) : (
                      <td key={c}>
                        <Inline text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside className="my-8 rounded-lg border-l-4 border-accent bg-surface p-5 md:p-6">
          <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-accent">
            <Lightbulb className="h-4 w-4" /> {block.title}
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-foreground">
            <Inline text={block.text} />
          </p>
        </aside>
      );
    case "inventory":
      return <InventoryStrip {...block} />;
  }
}

function InventoryStrip({
  title,
  rvClass,
  condition,
  limit = 3,
}: {
  title: string;
  rvClass?: string;
  condition?: "new" | "used";
  limit?: number;
}) {
  const { data, isLoading } = useQuery(rvsQuery());
  const matches = (data ?? []).filter(
    (rv) =>
      rv.status !== "sold" &&
      (!rvClass || rv.rv_class === rvClass) &&
      (!condition || rv.condition === condition),
  );
  const search: Record<string, string> = {};
  if (rvClass) search["rvClass"] = rvClass;
  if (condition) search["condition"] = condition;

  return (
    <section className="my-10 rounded-lg border border-border bg-surface p-5 md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            In stock now
          </p>
          <h3 className="mt-1 font-display text-lg font-bold">{title}</h3>
        </div>
        <Link
          to="/inventory"
          search={search as never}
          className="inline-flex items-center text-sm font-semibold text-primary hover:text-accent"
        >
          {matches.length > limit ? `See all ${matches.length}` : "Browse inventory"}
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit }, (_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-lg" />
          ))}
        </div>
      ) : matches.length ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.slice(0, limit).map((rv) => (
            <RvCard key={rv.id} rv={rv} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          New units arrive every week.{" "}
          <Link to="/contact" className="font-semibold text-primary underline">
            Tell us what you&apos;re looking for
          </Link>{" "}
          and we&apos;ll call you the day a match comes in.
        </p>
      )}
    </section>
  );
}
