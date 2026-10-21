import { createFileRoute } from "@tanstack/react-router";

import { LeadForm } from "@/components/site/LeadForm";
import { PageHeader } from "@/components/site/PageHeader";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "RV Delivery & Pickup | Nationwide Motorhome Transport" },
      {
        name: "description",
        content:
          "Local delivery, nationwide motorhome transport or customer pickup at our Bend, Oregon lot. Request a delivery quote for your RV purchase.",
      },
      { property: "og:title", content: "RV Delivery & Pickup | RV MotorHomes Dealership" },
      {
        property: "og:description",
        content: "Local drop-off, nationwide transport or pickup with a full orientation walkthrough.",
      },
    ],
  }),
  component: Delivery,
});

const OPTIONS = [
  {
    title: "Local delivery",
    copy: "Within 150 miles of Bend we deliver the coach to your driveway or storage lot, walk you through every system and make sure it's level and hooked up before we leave.",
  },
  {
    title: "Nationwide delivery",
    copy: "We coordinate insured, licensed drive-away or flatbed transport to all 48 contiguous states. You get a firm quote and a delivery window before anything ships.",
  },
  {
    title: "Customer pickup",
    copy: "Fly into Redmond (RDM), we'll pick you up. Plan on two to three hours at the dealership for orientation, paperwork and a shakedown drive.",
  },
  {
    title: "Transport coordination",
    copy: "Buying from out of state and need the coach staged, stored or inspected before it moves? We handle the logistics end to end.",
  },
];

function Delivery() {
  return (
    <>
      <PageHeader
        eyebrow="Delivery &amp; Pickup"
        title="However far you are, the coach gets to you"
        description="Roughly a third of our buyers live outside Oregon. Here's exactly how the handoff works."
      />

      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-8">
          {OPTIONS.map((option) => (
            <div key={option.title} className="border-l-2 border-accent pl-6">
              <h2 className="font-display text-lg font-bold">{option.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{option.copy}</p>
            </div>
          ))}
          <div className="rounded-lg bg-surface p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em]">Before delivery</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Every coach gets a pre-delivery inspection, fresh fluids where needed, a full tank of propane, sanitized
              fresh water system and a photo-documented condition report sent to you before it leaves the lot.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-7 shadow-card lg:sticky lg:top-28 lg:h-fit">
          <h2 className="font-display text-xl font-bold">Request a delivery quote</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us where the coach is headed and when you need it there.
          </p>
          <div className="mt-6">
            <LeadForm
              table="delivery_quotes"
              submitLabel="Request Delivery Quote"
              successMessage="Quote request received. We'll price the transport and get back to you."
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel" },
                { name: "target_date", label: "Target delivery date", type: "date" },
                {
                  name: "delivery_type",
                  label: "Delivery option",
                  type: "select",
                  options: ["Local delivery", "Nationwide delivery", "Customer pickup", "Transport coordination"],
                  full: true,
                },
                { name: "destination", label: "Destination city and state", full: true },
                { name: "rv_of_interest", label: "RV of interest", full: true },
                { name: "message", label: "Notes", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
