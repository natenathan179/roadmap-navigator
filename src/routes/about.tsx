import { Link, createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, ClipboardCheck, Handshake, Truck, Users, Wrench } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { DEALER } from "@/lib/dealership";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RV MotorHomes Dealership | Motorhome Dealership in Bend, Oregon" },
      {
        name: "description",
        content:
          "RV MotorHomes Dealership has sold and serviced motorhomes in Bend, Oregon since 2004. Meet the team, see our inspection standards and learn why buyers travel here.",
      },
      { property: "og:title", content: "About RV MotorHomes Dealership" },
      {
        property: "og:description",
        content: "Family-owned motorhome dealership in Central Oregon, selling and servicing coaches since 2004.",
      },
    ],
  }),
  component: About,
});

const REASONS = [
  { icon: BadgeCheck, title: "Quality RV inventory", copy: "We turn down more trades than we take. If it isn't right, it doesn't hit the lot." },
  { icon: ClipboardCheck, title: "Professional inspections", copy: "Every used coach gets a documented multi-point inspection you can read before you buy." },
  { icon: Handshake, title: "Transparent pricing", copy: "Prices are posted. No doc-fee games, no pack, no four-square." },
  { icon: Wrench, title: "In-house service", copy: "Eight bays and technicians who work on motorhomes every single day." },
  { icon: Truck, title: "Delivery assistance", copy: "Local drop-off or insured nationwide transport, coordinated for you." },
  { icon: Users, title: "Experienced specialists", copy: "Our average salesperson has nine years in RV — and owns a coach." },
];

const STATS = [
  { value: "2004", label: "Family-owned since" },
  { value: "3,100+", label: "Coaches delivered" },
  { value: "8", label: "Service bays" },
  { value: "4.9★", label: "Average customer rating" },
];

function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Central Oregon's motorhome specialists"
        description={`${DEALER.name} has been selling, servicing and delivering motorhomes from ${DEALER.city}, ${DEALER.state} since 2004.`}
      />

      <section className="container-page grid gap-12 py-14 lg:grid-cols-2 lg:items-center">
        <img
          src="/rv/dealership.jpg"
          alt="The RV MotorHomes Dealership dealership lot in Bend, Oregon"
          loading="lazy"
          width={1600}
          height={900}
          className="rounded-lg object-cover shadow-lift"
        />
        <div>
          <h2 className="font-display text-2xl font-bold">Our story</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              We started with four coaches on a gravel lot off Highway 97 and a simple idea: sell RVs the way we'd
              want one sold to us. That meant posting real prices, disclosing every flaw we found, and making sure
              the service department could stand behind whatever went out the gate.
            </p>
            <p>
              Two decades later the lot is paved and the service department has eight bays, but the standard hasn't
              moved. Coaches get inspected, reconditioned and photographed honestly. If a slide seal is aging or the
              tires are dated, it's in the listing.
            </p>
            <p>
              Most of our buyers are heading somewhere specific — the Oregon coast, the Cascades loop, a full-time
              life on the road. Our job is to hand you a coach that gets you there and a shop that keeps it going.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-navy py-14 text-navy-foreground">
        <div className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-extrabold text-accent">{stat.value}</p>
              <p className="mt-1 text-sm text-navy-foreground/75">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="font-display text-2xl font-bold">Why choose us?</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason) => (
            <div key={reason.title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                <reason.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold">{reason.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{reason.copy}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/inventory">View Inventory</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Contact the Dealership</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
