import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  ClipboardCheck,
  Handshake,
  MapPin,
  Phone,
  Search,
  Truck,
  Wrench,
} from "lucide-react";
import { useState } from "react";

import { RvCard } from "@/components/site/RvCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StarRating } from "@/components/site/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { DEALER, RV_CLASSES } from "@/lib/dealership";
import { postsQuery, reviewsQuery, rvsQuery } from "@/lib/inventory";
import type { InventorySearch } from "@/lib/search";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RVs & Travel Trailers for Sale in Bend, Oregon | RV MotorHomes Dealership" },
      {
        name: "description",
        content:
          "New and used RVs for sale in Bend, Oregon — travel trailers, fifth wheels, truck campers and motorhomes from Forest River, Coachmen, Grand Design, Keystone, Winnebago and more. RV financing, trade-ins, service and nationwide delivery.",
      },
      { property: "og:title", content: "RVs & Travel Trailers for Sale in Bend, Oregon | RV MotorHomes Dealership" },
      {
        property: "og:description",
        content:
          "Shop new and used travel trailers, fifth wheels and motorhomes with honest out-the-door pricing, RV financing and nationwide delivery.",
      },
    ],
  }),
  component: Home,
});

const TYPE_COPY: Record<string, string> = {
  "Travel Trailer": "Lightweight bunkhouse and couples floorplans, 17–33 ft",
  "Fifth Wheel": "Residential living space with rear kitchens and lofts",
  "Truck Camper": "Go-anywhere camping on a single-rear-wheel truck",
  "Class A": "Full-size luxury coaches, 29–45 ft",
  "Class C": "Family coaches with cab-over bunks",
};

const WHY_US = [
  { icon: BadgeCheck, title: "Quality RV Inventory", copy: "Every travel trailer, fifth wheel and motorhome is inspected and reconditioned before it hits the lot." },
  { icon: ClipboardCheck, title: "Professional Inspections", copy: "A multi-point inspection report covering roof, seals, brakes and appliances comes with every used RV." },
  { icon: BadgeDollarSign, title: "Transparent Pricing", copy: "One out-the-door price, posted publicly. No surprise prep or freight fees at the desk." },
  { icon: Handshake, title: "Trade-In Options", copy: "Real written numbers on your current RV, applied the same day." },
  { icon: Truck, title: "Nationwide Delivery", copy: "Local drop-off across Central Oregon or insured transport to all 48 states." },
  { icon: Wrench, title: "Experienced RV Specialists", copy: "An in-house service department that works on these units every day." },
];

function Home() {
  const navigate = useNavigate();
  const rvs = useQuery(rvsQuery());
  const reviews = useQuery(reviewsQuery());
  const posts = useQuery(postsQuery());

  const [quick, setQuick] = useState({ rvClass: "", make: "", condition: "", priceMax: "" });

  const all = rvs.data ?? [];
  const featured = all.filter((rv) => rv.status !== "sold").slice(0, 6);
  const makes = Array.from(new Set(all.map((rv) => rv.make))).sort();

  const typeCards = Array.from(new Set(all.map((rv) => rv.rv_class)))
    .slice(0, 4)
    .map((label) => {
      const example = all.find((rv) => rv.rv_class === label && rv.photos.length);
      return {
        label,
        image: example?.photos[0] ?? "/rv/hero.jpg",
        copy: TYPE_COPY[label] ?? `${all.filter((rv) => rv.rv_class === label).length} units in stock`,
      };
    });

  function runQuickSearch() {
    const search: InventorySearch = {};
    if (quick.rvClass) search.rvClass = quick.rvClass;
    if (quick.make) search.make = quick.make;
    if (quick.condition) search.condition = quick.condition;
    if (quick.priceMax) search.priceMax = Number(quick.priceMax);
    navigate({ to: "/inventory", search });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AutoDealer",
            name: DEALER.name,
            description:
              "New and used RV dealership in Bend, Oregon selling travel trailers, fifth wheels, truck campers and motorhomes with financing, service and nationwide delivery.",
            telephone: DEALER.phone,
            email: DEALER.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: DEALER.street,
              addressLocality: DEALER.city,
              addressRegion: DEALER.state,
              postalCode: DEALER.zip,
              addressCountry: "US",
            },
            areaServed: "United States",
            openingHours: ["Mo-Fr 08:00-18:00", "Sa 09:00-17:00"],
          }),
        }}
      />
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
        <img
          src="/rv/hero.jpg"
          alt="Luxury Class A motorhome on an open mountain highway at sunset"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/80 to-navy/20" />
        <div className="container-page flex min-h-[560px] flex-col justify-center py-20 md:min-h-[660px]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            {DEALER.city}, {DEALER.state} · Motorhome Specialists
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] md:text-6xl lg:text-7xl">
            Find Your Road to Adventure
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-foreground/85 md:text-lg">
            Explore quality new and pre-owned motorhomes backed by knowledgeable service and dealership support.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/inventory">View RV Inventory</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-navy-foreground hover:bg-white/10 hover:text-navy-foreground"
            >
              <Link to="/financing">Get Financing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* QUICK SEARCH */}
      <section className="border-b border-border bg-surface">
        <div className="container-page py-8">
          <div className="rounded-lg border border-border bg-card p-6 shadow-lift md:-mt-16 md:relative md:z-10">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-primary">
              I&apos;m Looking For
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-5">
              <select
                aria-label="RV class"
                className="h-11 rounded-md border border-input bg-background px-3 text-sm"
                value={quick.rvClass}
                onChange={(e) => setQuick((q) => ({ ...q, rvClass: e.target.value }))}
              >
                <option value="">Any RV class</option>
                {RV_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                aria-label="Manufacturer"
                className="h-11 rounded-md border border-input bg-background px-3 text-sm"
                value={quick.make}
                onChange={(e) => setQuick((q) => ({ ...q, make: e.target.value }))}
              >
                <option value="">Any manufacturer</option>
                {makes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                aria-label="Condition"
                className="h-11 rounded-md border border-input bg-background px-3 text-sm"
                value={quick.condition}
                onChange={(e) => setQuick((q) => ({ ...q, condition: e.target.value }))}
              >
                <option value="">New &amp; used</option>
                <option value="new">New</option>
                <option value="used">Used</option>
              </select>
              <Input
                aria-label="Maximum price"
                inputMode="numeric"
                placeholder="Max price"
                className="h-11"
                value={quick.priceMax}
                onChange={(e) => setQuick((q) => ({ ...q, priceMax: e.target.value }))}
              />
              <Button className="h-11 bg-accent text-accent-foreground hover:bg-accent/90" onClick={runQuickSearch}>
                <Search className="mr-2 h-4 w-4" />
                Search Inventory
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="Featured Motorhomes"
          title="Hand-picked coaches on the lot right now"
          description="Every unit is inspected, serviced and photographed in detail before it is listed."
          action={
            <Button asChild variant="outline">
              <Link to="/inventory">
                View all inventory <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          }
        />
        {rvs.isLoading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((rv) => (
              <RvCard key={rv.id} rv={rv} />
            ))}
          </div>
        )}
      </section>

      {/* BROWSE BY TYPE */}
      <section className="bg-surface py-16 md:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Browse by RV Type" title="Pick the class that fits how you travel" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {typeCards.map((card) => (
              <Link
                key={card.label}
                to="/inventory"
                search={{ rvClass: card.label }}
                className="group relative overflow-hidden rounded-lg shadow-card"
              >
                <img
                  src={card.image}
                  alt={`${card.label} RVs for sale in Bend, Oregon at RV MotorHomes Dealership`}
                  loading="lazy"
                  width={1600}
                  height={1067}
                  className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-navy-foreground">
                  <h3 className="font-display text-lg font-bold">{card.label}</h3>
                  <p className="mt-1 text-xs text-navy-foreground/75">{card.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="A dealership built around the coach, not the close"
          align="center"
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((item) => (
            <div key={item.title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINANCING + TRADE-IN CTA */}
      <section className="container-page grid gap-6 pb-16 md:grid-cols-2 md:pb-20">
        <div className="overflow-hidden rounded-lg bg-navy p-8 text-navy-foreground md:p-10">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Make Your RV Dreams a Reality</h2>
          <p className="mt-3 max-w-md text-navy-foreground/75">
            Apply once and we shop your application across multiple RV lenders. Terms from 10 to 20 years, with
            full-timer programs available.
          </p>
          <Button asChild className="mt-7 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/financing">Apply for Financing</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-card p-8 shadow-card md:p-10">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Ready for Your Next Adventure?</h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Trade in your current RV. Send us the details and photos and we&apos;ll come back with a real, written
            number — usually within one business day.
          </p>
          <Button asChild className="mt-7">
            <Link to="/trade-in">Get My Trade-In Estimate</Link>
          </Button>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-surface py-16 md:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Customer Reviews"
            title="What our owners say"
            action={
              <Button asChild variant="outline">
                <Link to="/reviews">Read all reviews</Link>
              </Button>
            }
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(reviews.data ?? []).slice(0, 3).map((review) => (
              <figure key={review.id} className="rounded-lg border border-border bg-card p-6 shadow-card">
                <StarRating rating={review.rating} />
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                  &ldquo;{review.body}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{review.customer_name}</span> ·{" "}
                  {new Date(review.reviewed_on).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="RV Buying Guide"
          title="Know before you buy"
          description="Straight answers to the questions we get asked on the lot every week."
          action={
            <Button asChild variant="outline">
              <Link to="/guides">All guides</Link>
            </Button>
          }
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {(posts.data ?? []).slice(0, 3).map((post) => (
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
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="bg-surface py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              Your RV dealership in Bend, Oregon
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                RV MotorHomes Dealership sells new and used RVs across Central Oregon and the wider Pacific Northwest. Our lot
                on Highway 97 carries lightweight travel trailers, family bunkhouses, residential fifth wheels, truck
                campers and diesel motorhomes from Forest River, Coachmen, Grand Design, Keystone, KZ, Lance, Newmar
                and Winnebago.
              </p>
              <p>
                Every unit is listed with real photography, complete manufacturer specifications, dry weight, GVWR,
                tank capacities and sleeping capacity so you can size a trailer against your tow vehicle before you
                drive out. If a spec you need isn&apos;t on the page, ask — we&apos;ll measure it and send it the same
                day.
              </p>
              <p>
                Shoppers travel to us from Redmond, Sisters, Prineville, La Pine, Madras, Eugene, Portland, Boise and
                Spokane. Can&apos;t make the trip? We coordinate insured RV transport to all 48 states and handle
                paperwork remotely.
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Common questions</h2>
            <dl className="mt-4 space-y-5 text-sm">
              {[
                {
                  q: "Do your listed RV prices include fees?",
                  a: "Our posted price is the price of the unit. Tax, title, registration and any delivery are added at the desk and shown in writing before you sign — no prep, freight or documentation surprises.",
                },
                {
                  q: "Can I finance a used travel trailer?",
                  a: "Yes. We submit one application to multiple RV lenders, with terms typically from 10 to 20 years depending on loan size, age of the unit and credit profile. Approvals are usually back within one business day.",
                },
                {
                  q: "How do I know a used RV is sound?",
                  a: "Every pre-owned unit gets a multi-point technician inspection covering roof membrane and seals, sidewall delamination, brakes and bearings, tyres, appliances, 12V and shore power before it is listed.",
                },
                {
                  q: "Will you take my current RV in trade?",
                  a: "We buy outright and take trades. Send year, make, model, mileage and photos through the trade-in form and we return a real written number, usually within a business day.",
                },
              ].map((item) => (
                <div key={item.q}>
                  <dt className="font-display font-bold text-foreground">{item.q}</dt>
                  <dd className="mt-1.5 text-muted-foreground">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="bg-navy py-16 text-navy-foreground md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Visit the Dealership</p>
            <h2 className="mt-3 font-display text-2xl font-bold md:text-3xl">
              Coffee&apos;s on. Come walk the lot.
            </h2>
            <p className="mt-4 max-w-md text-navy-foreground/75">
              We&apos;re just north of Bend on Highway 97, twenty minutes from Redmond Airport with plenty of room to
              test drive.
            </p>
            <dl className="mt-8 space-y-4 text-sm">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <dt className="font-semibold">Address</dt>
                  <dd className="text-navy-foreground/75">{DEALER.address}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <div>
                  <dt className="font-semibold">Phone</dt>
                  <dd className="text-navy-foreground/75">
                    <a href={DEALER.phoneHref} className="hover:text-accent">
                      {DEALER.phone}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/contact">Contact the Dealership</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/40 bg-transparent text-navy-foreground hover:bg-white/10 hover:text-navy-foreground"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${DEALER.mapQuery}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Directions
                </a>
              </Button>
            </div>
          </div>
          <img
            src="/rv/dealership.jpg"
            alt="RV MotorHomes Dealership dealership lot with rows of motorhomes"
            loading="lazy"
            width={1600}
            height={900}
            className="rounded-lg object-cover shadow-lift"
          />
        </div>
      </section>
    </>
  );
}
