import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { ARTICLES } from "@/content/articles";
import { postsQuery } from "@/lib/inventory";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "RV Motorhome Buying Guides & Blog | RV MotorHomes Dealership" },
      {
        name: "description",
        content:
          "RV motorhome buying guides: Class A, B and C motorhomes compared, real prices, used Class C buying tips, reliable brands and RV financing — from working RV dealers.",
      },
      { property: "og:title", content: "RV Buying Guide | RV MotorHomes Dealership" },
      {
        property: "og:description",
        content:
          "Practical motorhome buying advice from a dealership that inspects coaches every day.",
      },
    ],
  }),
  component: Guides,
});

function Guides() {
  const { data, isLoading } = useQuery(postsQuery());
  const [lead, ...rest] = ARTICLES;
  const posts = (data ?? []).filter((post) => !ARTICLES.some((a) => a.slug === post.slug));

  return (
    <>
      <PageHeader
        eyebrow="RV Buying Guide"
        title="Know before you buy"
        description="Straight answers to the questions we field on the lot every week — no fluff, no affiliate links."
      />

      <section className="container-page pt-14">
        <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-accent">
          Motorhome buyer&apos;s guides
        </h2>
        <Link
          to="/guides/$slug"
          params={{ slug: lead.slug }}
          className="group mt-5 grid overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-lift md:grid-cols-2"
        >
          <img
            src={lead.cover}
            alt={lead.coverAlt}
            width={1600}
            height={1067}
            className="h-56 w-full object-cover md:h-full"
          />
          <div className="flex flex-col justify-center p-7 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              {lead.category}
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold leading-snug group-hover:text-accent md:text-3xl">
              {lead.title}
            </h3>
            <p className="mt-3 text-muted-foreground">{lead.excerpt}</p>
            <p className="mt-5 text-sm font-semibold text-primary">Read the guide &rarr;</p>
          </div>
        </Link>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <Link
              key={article.slug}
              to="/guides/$slug"
              params={{ slug: article.slug }}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-lift"
            >
              <img
                src={article.cover}
                alt={article.coverAlt}
                loading="lazy"
                width={1600}
                height={1067}
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  {article.category}
                </p>
                <h3 className="mt-1.5 font-display text-base font-bold leading-snug group-hover:text-accent">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{article.excerpt}</p>
                <p className="mt-4 text-xs text-muted-foreground">
                  {formatDate(article.updatedAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-accent">
          More RV advice
        </h2>
        {isLoading ? (
          <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-72 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to="/guides/$slug"
                params={{ slug: post.slug }}
                className="group overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-lift"
              >
                <img
                  src={post.cover_image ?? "/rv/class-a-ext.jpg"}
                  alt=""
                  loading="lazy"
                  width={1600}
                  height={1067}
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="font-display text-base font-bold leading-snug group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {formatDate(post.published_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
