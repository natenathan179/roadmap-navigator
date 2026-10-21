import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Phone, Plus, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { InquiryModal, type InquiryKind } from "@/components/site/InquiryModal";
import { RvCard } from "@/components/site/RvCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/cart";
import { DEALER } from "@/lib/dealership";
import { miles, money, rvQuery, rvTitle, rvsQuery, type Rv } from "@/lib/inventory";

export const Route = createFileRoute("/inventory/$slug")({
  head: ({ params }) => {
    const words = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${words} for Sale | RV MotorHomes Dealership Bend, Oregon` },
        {
          name: "description",
          content: `${words} for sale at RV MotorHomes Dealership in Bend, Oregon. Full specifications, floorplan details, HD photos, financing and nationwide RV delivery.`,
        },
        { property: "og:title", content: `${words} for Sale | RV MotorHomes Dealership` },
        {
          property: "og:description",
          content: `Photos, specifications and pricing for this ${words} at RV MotorHomes Dealership, Bend, Oregon.`,
        },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: RvDetail,
});

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function Gallery({ rv }: { rv: Rv }) {
  const [index, setIndex] = useState(0);
  const photos = rv.photos.length ? rv.photos : ["/rv/hero.jpg"];
  const current = photos[Math.min(index, photos.length - 1)];
  const alt =
    rv.photo_alts[Math.min(index, photos.length - 1)] ??
    `${rvTitle(rv)} ${rv.rv_class} for sale in Bend Oregon — photo ${index + 1}`;

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg bg-muted">
        <img src={current} alt={alt} width={1600} height={1067} className="aspect-[3/2] w-full object-cover" />
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
            <span className="absolute bottom-3 right-3 rounded-full bg-foreground/70 px-3 py-1 text-xs font-semibold text-background">
              {index + 1} / {photos.length}
            </span>
          </>
        ) : null}
      </div>
      {photos.length > 1 ? (
        <div className="mt-3 flex snap-x gap-3 overflow-x-auto pb-2">
          {photos.map((photo, i) => (
            <button
              key={`${photo}-${i}`}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-20 w-28 shrink-0 snap-start overflow-hidden rounded-md border-2 ${
                i === index ? "border-accent" : "border-transparent"
              }`}
            >
              <img src={photo} alt={rv.photo_alts[i] ?? ""} loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RvDetail() {
  const { slug } = Route.useParams();
  const { data: rv, isLoading } = useQuery(rvQuery(slug));
  const { data: all } = useQuery(rvsQuery());
  const cart = useCart();
  const [modal, setModal] = useState<InquiryKind | null>(null);

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
        <h1 className="font-display text-2xl font-bold">That RV is no longer listed</h1>
        <p className="mt-3 text-muted-foreground">It may have sold. Browse what&apos;s currently on the lot.</p>
        <Button asChild className="mt-6">
          <Link to="/inventory">View inventory</Link>
        </Button>
      </div>
    );
  }

  const title = rvTitle(rv);
  const inCart = cart.items.some((i) => i.id === rv.id);
  const related = (all ?? []).filter((r) => r.id !== rv.id && r.rv_class === rv.rv_class).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    sku: rv.stock_number,
    description: rv.seo_description ?? rv.description ?? title,
    brand: { "@type": "Brand", name: rv.make },
    itemCondition: rv.condition === "new" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: rv.price,
      priceCurrency: "USD",
      availability: rv.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: DEALER.name },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="border-b border-border bg-surface">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-5">
          <Link to="/inventory" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to inventory
          </Link>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Stock #{rv.stock_number}</span>
        </div>
      </div>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge className="bg-navy text-navy-foreground capitalize hover:bg-navy">{rv.condition}</Badge>
            <Badge variant="secondary">{rv.rv_class}</Badge>
            {rv.featured ? <Badge className="bg-accent text-accent-foreground hover:bg-accent">Featured</Badge> : null}
            {rv.status === "sold" ? <Badge variant="destructive">Sold</Badge> : null}
          </div>
          <h1 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {rv.condition === "new" ? "New" : `${miles(rv.mileage)} miles`} · Sleeps {rv.sleeps ?? "—"} ·{" "}
            {rv.length_ft ? `${rv.length_ft} ft` : "—"} · {rv.slides ?? 0} slide{rv.slides === 1 ? "" : "s"} ·{" "}
            {rv.location}
          </p>

          <div className="mt-7">
            <Gallery rv={rv} />
          </div>

          {rv.highlights.length ? (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {rv.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 rounded-md bg-surface px-3 py-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {h}
                </li>
              ))}
            </ul>
          ) : null}

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

          {rv.description ? (
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold">
                About this {rv.year} {rv.make} {rv.model}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
                {rv.description.split(/\n\n+/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-12">
            <h2 className="font-display text-xl font-bold">Specifications</h2>
            <dl className="mt-4 grid gap-x-10 sm:grid-cols-2">
              <Spec label="Year" value={String(rv.year)} />
              <Spec label="Manufacturer" value={rv.make} />
              {rv.brand ? <Spec label="Brand" value={rv.brand} /> : null}
              <Spec label="Model" value={rv.model} />
              <Spec label="Type" value={rv.rv_type ?? rv.rv_class} />
              <Spec label="Condition" value={rv.condition === "new" ? "New" : "Used"} />
              {rv.engine ? <Spec label="Engine" value={rv.engine} /> : null}
              {rv.condition === "used" && rv.mileage ? <Spec label="Mileage" value={`${miles(rv.mileage)} mi`} /> : null}
              <Spec label="Length" value={rv.length_ft ? `${rv.length_ft} ft` : "—"} />
              <Spec label="Sleeps" value={rv.sleeps ? String(rv.sleeps) : "—"} />
              <Spec label="Slides" value={rv.slides !== null ? String(rv.slides) : "—"} />
              {rv.dry_weight ? <Spec label="Dry weight" value={`${miles(rv.dry_weight)} lbs`} /> : null}
              {rv.gvwr ? <Spec label="GVWR" value={`${miles(rv.gvwr)} lbs`} /> : null}
              {rv.fresh_water ? <Spec label="Fresh water" value={`${rv.fresh_water} gal`} /> : null}
              {rv.ext_color ? <Spec label="Exterior colour" value={rv.ext_color} /> : null}
              {rv.int_color ? <Spec label="Interior décor" value={rv.int_color} /> : null}
              <Spec label="VIN" value={rv.vin ?? "Available on request"} />
              <Spec label="Location" value={rv.location} />
            </dl>

            {Object.keys(rv.specs).length ? (
              <>
                <h3 className="mt-10 font-display text-lg font-bold">Full manufacturer specifications</h3>
                <dl className="mt-4 grid gap-x-10 sm:grid-cols-2">
                  {Object.entries(rv.specs).map(([label, value]) => (
                    <Spec key={label} label={label} value={String(value)} />
                  ))}
                </dl>
              </>
            ) : null}
          </section>

          {rv.features.length ? (
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold">Features &amp; equipment</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {rv.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-5">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-display font-bold">Inspected before delivery</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Every unit goes through a multi-point technician inspection covering roof seals, brakes, appliances,
                12V systems and tyres before it leaves our lot.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-5">
              <Truck className="h-6 w-6 text-accent" />
              <h3 className="mt-3 font-display font-bold">Nationwide RV delivery</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Can&apos;t reach Bend? We coordinate insured transport to all 48 states, plus local delivery across
                Central Oregon.
              </p>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-lg border border-border bg-card p-6 shadow-lift">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Our price</p>
            <p className="mt-1 font-display text-3xl font-extrabold text-foreground">{money(rv.price)}</p>
            {rv.msrp && rv.msrp > rv.price ? (
              <p className="mt-1 text-sm text-muted-foreground">
                MSRP <span className="line-through">{money(rv.msrp)}</span>{" "}
                <span className="font-semibold text-accent">Save {money(rv.msrp - rv.price)}</span>
              </p>
            ) : null}
            <p className="mt-1 text-xs text-muted-foreground">
              Status: {rv.status === "sold" ? "Sold" : "Available"} · Stock #{rv.stock_number}
            </p>

            <div className="mt-6 space-y-2">
              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setModal("information")}
              >
                Request Price &amp; Availability
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setModal("viewing")}>
                Schedule a Viewing
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const added = cart.add({
                    id: rv.id,
                    slug: rv.slug,
                    title,
                    stock_number: rv.stock_number,
                    price: rv.price,
                    photo: rv.photos[0] ?? null,
                  });
                  toast[added ? "success" : "info"](
                    added ? "Added to your quote list." : "That RV is already on your quote list.",
                  );
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {inCart ? "On your quote list" : "Add to Quote List"}
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/financing">Apply for Financing</Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <a href={DEALER.phoneHref}>
                  <Phone className="mr-2 h-4 w-4" /> Call {DEALER.phone}
                </a>
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {related.length ? (
        <section className="border-t border-border bg-surface py-14">
          <div className="container-page">
            <h2 className="font-display text-2xl font-bold">Similar {rv.rv_class}s for sale</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <RvCard key={r.id} rv={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <InquiryModal open={modal !== null} onClose={() => setModal(null)} kind={modal ?? "information"} rv={rv} />
    </>
  );
}
