import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { DEALER } from "@/lib/dealership";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | RV MotorHomes Dealership" },
      {
        name: "description",
        content:
          "Terms and conditions for using the RV MotorHomes Dealership website, including pricing accuracy, inventory availability, financing disclaimers and warranty terms.",
      },
      { property: "og:title", content: "Terms & Conditions | RV MotorHomes Dealership" },
      { property: "og:description", content: "Website terms, pricing accuracy and financing disclaimers." },
    ],
  }),
  component: Terms,
});

const SECTIONS = [
  {
    title: "Inventory and availability",
    body: "Inventory listings are updated regularly but units may sell before a listing is removed. Availability is not guaranteed until a purchase agreement is signed and a deposit is received.",
  },
  {
    title: "Pricing accuracy",
    body: "We make every effort to post accurate prices, specifications, mileage and equipment. Errors do occur. Advertised prices exclude tax, title, registration and any documentary fee, and RV MotorHomes Dealership reserves the right to correct pricing or specification errors at any time.",
  },
  {
    title: "Photos and specifications",
    body: "Photos show the actual unit unless otherwise noted. Floorplan diagrams, brochure images and manufacturer specifications are provided for reference and may differ from the coach as equipped. Verify anything that matters to your purchase decision in person or in writing.",
  },
  {
    title: "Financing disclaimer",
    body: "Financing is subject to lender approval. Estimated payments shown anywhere on this site are illustrations only and are not offers of credit. Actual rate, term, down payment and monthly payment depend on creditworthiness, loan amount, coach age and lender program.",
  },
  {
    title: "Trade-in estimates",
    body: "Trade-in and purchase estimates provided online are preliminary and subject to physical inspection, title verification and current market conditions. Final offers are issued in writing after inspection.",
  },
  {
    title: "Warranty",
    body: "New coaches carry the manufacturer's warranty; terms are set by the manufacturer, not the dealership. Used units are sold as-is unless a written warranty or service contract is included in the purchase agreement. An implied warranty disclaimer, where applicable, will be disclosed in writing before sale.",
  },
  {
    title: "Use of this website",
    body: "Content on this site is provided for informational purposes. You may not scrape, republish or reuse our listings, photos or written content without written permission. Submitting false information through our forms is prohibited.",
  },
];

function Terms() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms &amp; Conditions" description="Last updated: January 2026" />
      <section className="container-page max-w-3xl space-y-8 py-14">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-lg font-bold">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </div>
        ))}
        <p className="text-sm text-muted-foreground">
          Questions? Contact {DEALER.name} at{" "}
          <a href={DEALER.phoneHref} className="text-accent hover:underline">
            {DEALER.phone}
          </a>
          .
        </p>
      </section>
    </>
  );
}
