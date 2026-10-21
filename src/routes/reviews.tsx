import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { StarRating } from "@/components/site/StarRating";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEALER } from "@/lib/dealership";
import { reviewsQuery } from "@/lib/inventory";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "RV Dealership Reviews | RV MotorHomes Dealership, Michigan" },
      {
        name: "description",
        content:
          "Read 35 verified customer reviews of RV MotorHomes Dealership in Michigan — travel trailer and motorhome sales, honest out-the-door pricing, financing, trade-ins, service and nationwide RV delivery.",
      },
      { property: "og:title", content: "Customer Reviews | RV MotorHomes Dealership, Michigan" },
      {
        property: "og:description",
        content: "What RV owners across Michigan and the Midwest say about buying and servicing with RV MotorHomes Dealership.",
      },
    ],
  }),
  component: Reviews,
});

function Reviews() {
  const { data, isLoading } = useQuery(reviewsQuery());
  const reviews = data ?? [];
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const averageLabel = reviews.length ? average.toFixed(1) : "—";

  const jsonLd = reviews.length
    ? {
        "@context": "https://schema.org",
        "@type": "AutoDealer",
        name: DEALER.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: DEALER.street || undefined,
          addressLocality: DEALER.city || undefined,
          addressRegion: DEALER.state,
          postalCode: DEALER.zip || undefined,
          addressCountry: "US",
        },
        telephone: DEALER.phone,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: average.toFixed(1),
          reviewCount: reviews.length,
          bestRating: 5,
        },
      }
    : null;

  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}

      <PageHeader
        eyebrow="Customer Reviews"
        title="What our RV owners say"
        description={`${averageLabel} average rating across ${reviews.length} verified customer reviews of our travel trailer, fifth wheel and motorhome sales, service and delivery.`}
      />

      <section className="container-page py-14">
        <div className="mb-10 grid gap-4 rounded-lg border border-border bg-surface p-6 sm:grid-cols-3">
          <div>
            <p className="font-display text-4xl font-extrabold text-primary">{averageLabel}</p>
            <StarRating rating={Math.round(average)} />
            <p className="mt-1 text-xs text-muted-foreground">Average customer rating</p>
          </div>
          <div>
            <p className="font-display text-4xl font-extrabold text-primary">{reviews.length}</p>
            <p className="mt-2 text-xs text-muted-foreground">Verified reviews published</p>
          </div>
          <div>
            <p className="font-display text-4xl font-extrabold text-primary">48</p>
            <p className="mt-2 text-xs text-muted-foreground">States we deliver RVs to</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-56 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.id} className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-card">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar_url ?? "/favicon.ico"}
                    alt={`${review.customer_name}, verified RV MotorHomes Dealership customer`}
                    loading="lazy"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-display text-sm font-bold">{review.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{review.location ?? DEALER.location}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <StarRating rating={review.rating} />
                </div>
                {review.title ? <h2 className="mt-3 font-display text-base font-bold">{review.title}</h2> : null}
                <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{review.body}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-xs text-muted-foreground">
                  Reviewed{" "}
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

        <div className="mt-14 rounded-lg bg-navy p-10 text-center text-navy-foreground">
          <h2 className="font-display text-2xl font-bold">Ready to join them?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-navy-foreground/80">
            Browse our full inventory of new and used travel trailers, fifth wheels and motorhomes, or call our team in
            Michigan for honest out-the-door pricing.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/inventory">View RV Inventory</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/30 bg-transparent text-navy-foreground hover:bg-white/10">
              <a href={DEALER.phoneHref}>Call {DEALER.phone}</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
