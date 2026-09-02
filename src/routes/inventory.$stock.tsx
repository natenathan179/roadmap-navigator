import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { useState } from "react";

import { LeadForm } from "@/components/site/LeadForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEALER } from "@/lib/dealership";
import { miles, money, rvQuery, rvTitle, type Rv } from "@/lib/inventory";

export const Route = createFileRoute("/inventory/$stock")({
  head: ({ params }) => ({
    meta: [
      { title: `Motorhome Stock #${params.stock} for Sale | Summit Ridge RV` },
      {
        name: "description",
        content: `View photos, specifications, mileage and pricing for stock #${params.stock} at Summit Ridge RV in Bend, Oregon. Request info, schedule a viewing or apply for financing.`,
      },
      { property: "og:title", content: `Motorhome Stock #${params.stock} | Summit Ridge RV` },
      {
        property: "og:description",
        content: "Full specifications, HD photo gallery and pricing on this motorhome.",
      },
    ],
  }),
  component: RvDetail,
});

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function Gallery({ rv }: { rv: Rv }) {
  const [index, setIndex] = useState(0);
  const photos = rv.photos.length ? rv.photos : ["/rv/class-a-ext.jpg"];
  const current = photos[Math.min(index, photos.length - 1)];

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg bg-muted">
        <img
          src={current}
          alt={`${rvTitle(rv)} — photo ${index + 1} of ${photos.length}`}
          width={1600}
          height={1067}
          className="aspect-[3/2] w-full object-cover"
        />
        {photos.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/85 p-2 shadow-card"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => setIndex((i) => (i + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/85 p-2 shadow-card"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
      {photos.length > 1 ? (
        <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-2">
          {photos.map((photo, i) => (
            <button
              key={`${photo}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-20 w-28 shrink-0 snap-start overflow-hidden rounded-md border-2 ${
                i === index ? "border-accent" : "border-transparent"
              }`}
            >
              <img src={photo} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RvDetail() {
  const { stock } = Route.useParams();
  const { data: rv, isLoading } = useQuery(rvQuery(stock));

  if (isLoading) {
    return (
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1.6fr_1fr]">
        <Skeleton className="aspect-[3/2] w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (!rv) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold">That motorhome is no longer listed</h1>
        <p className="mt-3 text-muted-foreground">It may have sold. Browse what&apos;s currently on the lot.</p>
        <Button asChild className="mt-6">
          <Link to="/inventory">View inventory</Link>
        </Button>
      </div>
    );
  }

  const title = rvTitle(rv);

  return (
    <>
      <div className="border-b border-border bg-surface">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-5">
          <Link to="/inventory" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to inventory
          </Link>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Stock #{rv.stock_number}
          </span>
        </div>
      </div>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge className="bg-navy text-navy-foreground uppercase">{rv.condition}</Badge>
            <Badge variant="secondary">{rv.rv_class}</Badge>
            {rv.status === "sold" ? <Badge variant="destructive">Sold</Badge> : null}
          </div>
          <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {miles(rv.mileage)} miles · {rv.fuel_type} · Sleeps {rv.sleeps ?? "—"} · {rv.location}
          </p>

          <div className="mt-7">
            <Gallery rv={rv} />
          </div>

          {rv.video_url ? (
            <a
              href={rv.video_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
            >
              Watch the video walkthrough →
            </a>
          ) : null}

          <section className="mt-12">
            <h2 className="font-display text-xl font-bold">Specifications</h2>
            <dl className="mt-4 grid gap-x-10 sm:grid-cols-2">
              <Spec label="Year" value={String(rv.year)} />
              <Spec label="Manufacturer" value={rv.make} />
              <Spec label="Model" value={rv.model} />
              <Spec label="Class" value={rv.rv_class} />
              <Spec label="Engine" value={rv.engine ?? "—"} />
              <Spec label="Fuel type" value={rv.fuel_type} />
              <Spec label="Mileage" value={`${miles(rv.mileage)} mi`} />
              <Spec label="Length" value={rv.length_ft ? `${rv.length_ft} ft` : "—"} />
              <Spec label="Sleeps" value={rv.sleeps ? String(rv.sleeps) : "—"} />
              <Spec label="Slides" value={rv.slides !== null ? String(rv.slides) : "—"} />
              <Spec label="VIN" value={rv.vin ?? "Available on request"} />
              <Spec label="Location" value={rv.location} />
            </dl>
          </section>

          {rv.description ? (
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold">Description</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">{rv.description}</p>
            </section>
          ) : null}

          {rv.features.length ? (
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold">Features &amp; equipment</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {rv.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-lg border border-border bg-card p-6 shadow-lift">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Our price</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-foreground">{money(rv.price)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Status: {rv.status === "sold" ? "Sold" : "Available"} · Stock #{rv.stock_number}
            </p>

            <div className="mt-6 space-y-2">
              <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={DEALER.phoneHref}>
                  <Phone className="mr-2 h-4 w-4" /> Call {DEALER.phone}
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/financing">Apply for Financing</Link>
              </Button>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <h2 className="font-display text-base font-bold">Request information</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Ask a question or schedule a viewing. We reply the same business day.
              </p>
              <div className="mt-4">
                <LeadForm
                  compact
                  table="inquiries"
                  hidden={{ rv_id: rv.id, kind: "information" }}
                  defaults={{ rv_of_interest: `${title} (Stock #${rv.stock_number})` }}
                  submitLabel="Request Information"
                  successMessage="Thanks — a product specialist will reach out shortly."
                  fields={[
                    { name: "name", label: "Name", required: true },
                    { name: "email", label: "Email", type: "email", required: true },
                    { name: "phone", label: "Phone", type: "tel" },
                    { name: "preferred_date", label: "Preferred viewing date", type: "date" },
                    { name: "rv_of_interest", label: "RV of interest" },
                    { name: "message", label: "Message", type: "textarea", placeholder: "Questions about this coach?" },
                  ]}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
