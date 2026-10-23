import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, CheckCircle2, ChevronDown, Clock, Phone } from "lucide-react";

import { ArticleBody } from "@/components/site/ArticleBody";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ARTICLES, findArticle } from "@/content/articles";
import { markdownToBlocks, readMinutes, slugify, type ArticleBlock } from "@/lib/articles";
import { DEALER } from "@/lib/dealership";
import { postQuery, postsQuery } from "@/lib/inventory";

export const Route = createFileRoute("/guides/$slug")({
  head: ({ params }) => {
    const article = findArticle(params.slug);
    if (article) {
      return {
        meta: [
          { title: article.metaTitle },
          { name: "description", content: article.metaDescription },
          { property: "og:title", content: article.metaTitle },
          { property: "og:description", content: article.metaDescription },
          { property: "og:type", content: "article" },
          { property: "og:image", content: article.cover },
          { property: "article:published_time", content: article.publishedAt },
          { property: "article:modified_time", content: article.updatedAt },
          { property: "article:section", content: article.category },
          { name: "twitter:title", content: article.metaTitle },
          { name: "twitter:description", content: article.metaDescription },
        ],
      };
    }
    const readable = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${readable} | RV Buying Guide | ${DEALER.name}` },
        {
          name: "description",
          content: `${readable} — practical motorhome buying advice from the team at ${DEALER.name} in ${DEALER.stateName}.`,
        },
        { property: "og:title", content: `${readable} | RV Buying Guide` },
        { property: "og:type", content: "article" },
        {
          property: "og:description",
          content: `${readable} — practical motorhome buying advice from working RV dealers.`,
        },
      ],
    };
  },
  component: Guide,
});

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

type GuideView = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  cover: string | null;
  coverAlt: string;
  publishedAt: string;
  updatedAt: string;
  keyTakeaways: string[];
  blocks: ArticleBlock[];
  faqs: { q: string; a: string }[];
  related: string[];
};

function Guide() {
  const { slug } = Route.useParams();
  const article = findArticle(slug);
  const { data: post, isLoading } = useQuery({ ...postQuery(slug), enabled: !article });

  if (article) return <GuideLayout guide={article} />;

  if (isLoading) {
    return (
      <div className="container-page max-w-3xl py-16">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="mt-6 h-64 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold">That guide isn&apos;t published</h1>
        <Button asChild className="mt-6">
          <Link to="/guides">Back to all guides</Link>
        </Button>
      </div>
    );
  }

  return (
    <GuideLayout
      guide={{
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: "RV Buying Guide",
        cover: post.cover_image,
        coverAlt: post.title,
        publishedAt: post.published_at,
        updatedAt: post.published_at,
        keyTakeaways: [],
        blocks: markdownToBlocks(post.body),
        faqs: [],
        related: ARTICLES.slice(0, 3).map((a) => a.slug),
      }}
    />
  );
}

function GuideLayout({ guide }: { guide: GuideView }) {
  const toc = guide.blocks.filter((b) => b.type === "h2").map((b) => b.text);
  if (guide.faqs.length) toc.push("Frequently Asked Questions");
  const minutes = readMinutes(guide.blocks, [
    ...guide.keyTakeaways,
    ...guide.faqs.flatMap((f) => [f.q, f.a]),
  ]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.excerpt ?? undefined,
      image: guide.cover ?? undefined,
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt,
      articleSection: guide.category,
      author: { "@type": "Organization", name: DEALER.name },
      publisher: {
        "@type": "Organization",
        name: DEALER.name,
        logo: { "@type": "ImageObject", url: "/logo.svg" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "/" },
        { "@type": "ListItem", position: 2, name: "RV Buying Guide", item: "/guides" },
        { "@type": "ListItem", position: 3, name: guide.title },
      ],
    },
    ...(guide.faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: guide.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-navy text-navy-foreground">
        <div className="container-page py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="text-xs text-navy-foreground/65">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link to="/" className="hover:text-accent">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link to="/guides" className="hover:text-accent">
                  RV Buying Guide
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="line-clamp-1 text-navy-foreground/85">{guide.category}</li>
            </ol>
          </nav>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {guide.category}
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-3xl font-extrabold leading-tight md:text-[2.75rem]">
            {guide.title}
          </h1>
          {guide.excerpt ? (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-navy-foreground/75 md:text-lg">
              {guide.excerpt}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-foreground/70">
            <span>By the {DEALER.name} sales team</span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-accent" />
              Updated <time dateTime={guide.updatedAt}>{formatDate(guide.updatedAt)}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-accent" />
              {minutes} min read
            </span>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:py-14">
        <article className="min-w-0 max-w-3xl">
          {guide.cover ? (
            <img
              src={guide.cover}
              alt={guide.coverAlt}
              width={1600}
              height={1067}
              className="aspect-[16/9] w-full rounded-lg object-cover shadow-card"
            />
          ) : null}

          {guide.keyTakeaways.length ? (
            <section className="mt-8 rounded-lg border border-border bg-card p-6 shadow-card">
              <h2 className="font-display text-base font-bold uppercase tracking-[0.12em] text-primary">
                Key takeaways
              </h2>
              <ul className="mt-4 space-y-3">
                {guide.keyTakeaways.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {toc.length > 2 ? (
            <details className="group mt-6 rounded-lg border border-border bg-surface lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-display text-sm font-bold">
                In this guide
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <TableOfContents items={toc} className="px-4 pb-4" />
            </details>
          ) : null}

          <div className="mt-4">
            <ArticleBody blocks={guide.blocks} />
          </div>

          {guide.faqs.length ? (
            <section className="mt-14">
              <h2
                id={slugify("Frequently Asked Questions")}
                className="scroll-mt-28 font-display text-2xl font-extrabold text-primary md:text-[1.6rem]"
              >
                Frequently Asked Questions
              </h2>
              <div className="mt-5 divide-y divide-border rounded-lg border border-border">
                {guide.faqs.map((faq) => (
                  <details key={faq.q} className="group p-5" open>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <h3 className="font-display text-base font-bold leading-snug">{faq.q}</h3>
                      <ChevronDown className="mt-0.5 h-5 w-5 shrink-0 text-accent transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-14 rounded-lg bg-navy p-7 text-navy-foreground md:p-9">
            <h2 className="font-display text-xl font-bold md:text-2xl">
              Ready to find your motorhome?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy-foreground/75">
              Every RV on our lot is inspected, priced publicly and photographed in detail.
              Financing, trade-ins and nationwide delivery are available.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/inventory">View Inventory</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/25 bg-transparent text-navy-foreground hover:bg-white/10 hover:text-navy-foreground"
              >
                <Link to="/financing">Get Pre-Approved</Link>
              </Button>
            </div>
          </section>

          <Link
            to="/guides"
            className="mt-10 inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-accent"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> All RV buying guides
          </Link>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            {toc.length > 2 ? (
              <div className="rounded-lg border border-border bg-card p-5 shadow-card">
                <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-primary">
                  In this guide
                </p>
                <TableOfContents items={toc} className="mt-3" />
              </div>
            ) : null}
            <div className="rounded-lg bg-surface p-5">
              <p className="font-display text-base font-bold">Talk to an RV specialist</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Questions about a class, floorplan or payment? We&apos;re happy to help.
              </p>
              <a
                href={DEALER.phoneHref}
                className="mt-4 flex items-center gap-2 font-display text-lg font-bold text-primary hover:text-accent"
              >
                <Phone className="h-4 w-4 text-accent" />
                {DEALER.phone}
              </a>
              <Button asChild className="mt-4 w-full">
                <Link to="/inventory">Browse Motorhomes</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <RelatedGuides slugs={guide.related.filter((s) => s !== guide.slug)} />
    </>
  );
}

function TableOfContents({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ol className={`space-y-2 text-sm ${className}`}>
      {items.map((text) => (
        <li key={text}>
          <a
            href={`#${slugify(text)}`}
            className="block leading-snug text-muted-foreground hover:text-accent"
          >
            {text}
          </a>
        </li>
      ))}
    </ol>
  );
}

function RelatedGuides({ slugs }: { slugs: string[] }) {
  const { data: posts } = useQuery(postsQuery());
  const cards = slugs
    .map((slug) => {
      const article = findArticle(slug);
      if (article)
        return { slug, title: article.title, excerpt: article.excerpt, cover: article.cover };
      const post = posts?.find((p) => p.slug === slug);
      return post
        ? { slug, title: post.title, excerpt: post.excerpt, cover: post.cover_image }
        : null;
    })
    .filter((c) => c !== null);

  if (!cards.length) return null;

  return (
    <section className="border-t border-border bg-surface">
      <div className="container-page py-14">
        <h2 className="font-display text-2xl font-bold">Keep reading</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.slug}
              to="/guides/$slug"
              params={{ slug: card.slug }}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-lift"
            >
              <img
                src={card.cover ?? "/rv/class-a-ext.jpg"}
                alt=""
                loading="lazy"
                width={1600}
                height={1067}
                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-5">
                <h3 className="font-display text-base font-bold leading-snug group-hover:text-accent">
                  {card.title}
                </h3>
                {card.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{card.excerpt}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
