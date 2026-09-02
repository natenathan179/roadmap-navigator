import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { StarRating } from "@/components/site/StarRating";
import { Skeleton } from "@/components/ui/skeleton";
import { reviewsQuery } from "@/lib/inventory";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews | Summit Ridge RV, Bend Oregon" },
      {
        name: "description",
        content:
          "Read verified customer reviews of Summit Ridge RV in Bend, Oregon — motorhome sales, financing, trade-ins, service and nationwide delivery.",
      },
      { property: "og:title", content: "Customer Reviews | Summit Ridge RV" },
      { property: "og:description", content: "What motorhome owners say about buying and servicing with us." },
    ],
  }),
  component: Reviews,
});

function Reviews() {
  const { data, isLoading } = useQuery(reviewsQuery());
  const reviews = data ?? [];
  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <>
      <PageHeader
        eyebrow="Customer Reviews"
        title="What our owners say"
        description={`${average} average rating across ${reviews.length} verified customer reviews.`}
      />

      <section className="container-page py-14">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {reviews.map((review) => (
              <figure key={review.id} className="rounded-lg border border-border bg-card p-6 shadow-card">
                <StarRating rating={review.rating} />
                <blockquote className="mt-4 text-sm leading-relaxed">&ldquo;{review.body}&rdquo;</blockquote>
                <figcaption className="mt-5 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{review.customer_name}</span> ·{" "}
                  {new Date(review.reviewed_on).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
