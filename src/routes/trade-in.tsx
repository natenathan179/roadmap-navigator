import { createFileRoute } from "@tanstack/react-router";

import { LeadForm } from "@/components/site/LeadForm";
import { PageHeader } from "@/components/site/PageHeader";
import { CONDITIONS } from "@/lib/dealership";

export const Route = createFileRoute("/trade-in")({
  head: () => ({
    meta: [
      { title: "Trade In or Sell Your RV | RV MotorHomes Dealership, Bend Oregon" },
      {
        name: "description",
        content:
          "Get a written trade-in value for your motorhome from RV MotorHomes Dealership in Bend, Oregon. We buy quality used RVs outright or apply your equity to your next coach.",
      },
      { property: "og:title", content: "Trade In or Sell Your RV | RV MotorHomes Dealership" },
      {
        property: "og:description",
        content: "Send us the details and photos — we come back with a real number, usually within a business day.",
      },
    ],
  }),
  component: TradeIn,
});

function TradeIn() {
  return (
    <>
      <PageHeader
        eyebrow="Trade-In &amp; Consignment"
        title="Ready for Your Next Adventure? Trade In Your RV."
        description="Whether you're upgrading to a bigger coach or stepping down to something easier to park, we'll give you a straight number on what you're driving now."
      />

      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1.15fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-7 shadow-card">
          <h2 className="font-display text-xl font-bold">Tell us about your RV</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The more detail you give us, the tighter the estimate. Photos help most.
          </p>
          <div className="mt-6">
            <LeadForm
              table="trade_in_requests"
              submitLabel="Get My Trade-In Estimate"
              successMessage="Got it. An appraiser will follow up with your estimate shortly."
              fields={[
                { name: "name", label: "Your name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel" },
                { name: "location", label: "Where is the RV located?" },
                { name: "year", label: "Year", type: "number" },
                { name: "make", label: "Manufacturer" },
                { name: "model", label: "Model" },
                { name: "mileage", label: "Mileage", type: "number" },
                { name: "condition", label: "Condition", type: "select", options: [...CONDITIONS] },
                { name: "asking_value", label: "Asking / expected value ($)", type: "number" },
                { name: "vin", label: "VIN", full: true },
                {
                  name: "notes",
                  label: "Condition notes, upgrades, damage, service history",
                  type: "textarea",
                },
              ]}
            />
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Estimates are preliminary and subject to a physical inspection. Final offers depend on verified condition,
            title status and current market demand.
          </p>
        </div>

        <div>
          <img
            src="/rv/class-c-ext.jpg"
            alt="Used Class C motorhome being appraised at the dealership"
            loading="lazy"
            width={1600}
            height={1067}
            className="rounded-lg object-cover shadow-card"
          />
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-display text-base font-bold">Three ways to move your coach</h3>
              <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                <li>
                  <span className="font-semibold text-foreground">Trade it in.</span> Apply your equity directly to
                  your next unit and reduce your taxable purchase price where applicable.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Sell it outright.</span> We buy clean, well-kept
                  motorhomes for our own inventory — no obligation to purchase from us.
                </li>
                <li>
                  <span className="font-semibold text-foreground">Consign it.</span> We market, show and handle
                  paperwork while your coach sits on our lot.
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-surface p-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em]">What affects your value</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Chassis hours and mileage, roof and seal condition, tire age, slide operation, house battery health,
                interior wear, service records and whether the coach has been stored under cover.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
