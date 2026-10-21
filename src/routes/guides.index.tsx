import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { postsQuery } from "@/lib/inventory";

export const Route = createFileRoute("/guides/")({
  head: () => ({
    meta: [
      { title: "RV Buying Guide | How to Choose a Motorhome | RV MotorHomes Dealership" },
      {
        name: "description",
        content:
          "Class A vs B vs C, what motorhomes really cost, diesel vs gas, used RV inspection checklists and financing basics — practical guides from working RV dealers.",
      },
      { property: "og:title", content: "RV Buying Guide | RV MotorHomes Dealership" },
      {
        property: "og:description",
        content: "Practical motorhome buying advice from a dealership that inspects coaches every day.",
      },
    ],
  }),
  component: Guides,
});

function Guides() {
  const { data, isLoading } = useQuery(postsQuery());

  return (
    <>
      <PageHeader
        eyebrow="RV Buying Guide"
        title="Know before you buy"
        description="Straight answers to the questions we field on the lot every week — no fluff, no affiliate links."
      />

      <section className="container-page py-14">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-72 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(data ?? []).map((post) => (
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
                  <h2 className="font-display text-base font-bold leading-snug group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
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
