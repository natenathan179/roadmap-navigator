import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, Clock, Receipt, Wrench } from "lucide-react";

import { PageHeader } from "@/components/site/PageHeader";
import { absoluteUrl, DEALER } from "@/lib/dealership";

// The return window, deposit window and refund timing below must match the return policy
// entered in Google Merchant Center — change both together.
const RETURN_DAYS = 7;
const DEPOSIT_HOURS = 72;
const DAMAGE_REPORT_HOURS = 48;
const REFUND_BUSINESS_DAYS = 10;
const MOTORHOME_MILE_LIMIT = 250;

export const Route = createFileRoute("/return-policy")({
  head: () => ({
    meta: [
      { title: `Return & Refund Policy | ${DEALER.name}` },
      {
        name: "description",
        content: `${RETURN_DAYS}-day RV return policy, ${DEPOSIT_HOURS}-hour refundable deposits, transport damage coverage and refunds within ${REFUND_BUSINESS_DAYS} business days at ${DEALER.name}, ${DEALER.stateName}.`,
      },
      { property: "og:title", content: `Return & Refund Policy | ${DEALER.name}` },
      {
        property: "og:description",
        content: `${RETURN_DAYS}-day returns, refundable deposits and transport damage coverage on every RV we sell.`,
      },
    ],
  }),
  component: ReturnPolicy,
});

const SUMMARY = [
  { icon: CalendarCheck, label: `${RETURN_DAYS}-day returns`, copy: "From the day you take delivery or pick up." },
  { icon: Clock, label: `${DEPOSIT_HOURS}-hour deposit refund`, copy: `Cancel within ${DEPOSIT_HOURS} hours of paying for a full refund.` },
  { icon: Wrench, label: "Transport damage covered", copy: "We repair it at our cost, or refund you in full." },
  { icon: Receipt, label: `Refunds in ${REFUND_BUSINESS_DAYS} business days`, copy: "Back to your original payment method." },
];

type Section = { title: string; body?: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    title: `${RETURN_DAYS}-day return window`,
    body: `You may return any new or used RV purchased from ${DEALER.name} within ${RETURN_DAYS} calendar days of delivery or pickup, whichever applies. To be eligible, the RV must meet all of the following:`,
    points: [
      "It is in the same condition as when you received it, with no new damage, wear or odors.",
      "It has not been modified, and any accessories you added have been removed without damage.",
      `Motorhomes have no more than ${MOTORHOME_MILE_LIMIT} miles added to the odometer since delivery.`,
      "Holding tanks are emptied and flushed, and the interior is clean.",
      "All keys, remotes, manuals and any title or registration documents we gave you are returned with it.",
    ],
  },
  {
    title: "Items that can't be returned",
    points: [
      "Units custom-ordered from the factory to your specification.",
      "Parts, accessories and service work, which are covered by their own warranties.",
      "RVs damaged, modified or used beyond the conditions above after delivery.",
    ],
  },
  {
    title: "How to start a return",
    body: `Call us at ${DEALER.phone} or email ${DEALER.email} within the ${RETURN_DAYS}-day window, with your name, the RV's stock number and the reason for the return. We'll confirm eligibility and agree a date for you to bring the RV back to our ${DEALER.stateName} dealership, where we'll inspect it with you. If you can't bring it back yourself, we can arrange transport; the cost is quoted in advance and deducted from your refund.`,
  },
  {
    title: "Your refund",
    points: [
      "Once the RV passes return inspection, we refund the full purchase price. We don't charge a restocking fee.",
      `Refunds are issued within ${REFUND_BUSINESS_DAYS} business days of the inspection, back to your original payment method.`,
      "If you financed the purchase, we cancel the contract or pay off the loan with your lender directly, and refund any down payment you made.",
      "If you traded in an RV, we return your trade-in or, if it has already been sold, refund its agreed trade-in value.",
      "Sales tax we collected is refunded. Title and registration fees already paid to the state are refunded only where the state returns them to us.",
      "Delivery charges for the original sale are not refunded, except for the transport damage and not-as-described cases below.",
    ],
  },
  {
    title: "Deposits",
    body: `A deposit holds an RV for you until the purchase agreement is signed. If you cancel within ${DEPOSIT_HOURS} hours of paying it, we refund the full deposit. After ${DEPOSIT_HOURS} hours, the deposit is non-refundable, because we've taken the unit off the market for you. Your deposit is always refunded in full, at any time, if we can't deliver the RV as described or it is no longer available.`,
  },
  {
    title: "Transport damage or not as described",
    body: `Inspect your RV when it arrives. If it was damaged in transport, or doesn't match its listing — for example, the wrong floorplan, missing equipment or undisclosed damage — tell us within ${DAMAGE_REPORT_HOURS} hours of delivery, with photos if you can. We'll repair it at our cost, including any transport needed to do so. If it can't be repaired to the condition it was sold in, we'll cancel the sale and give you a full refund, including the delivery charge. This applies on top of the ${RETURN_DAYS}-day return window.`,
  },
];

const returnPolicyJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: DEALER.name,
  url: DEALER.siteUrl,
  telephone: DEALER.phone,
  email: DEALER.email,
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    url: absoluteUrl("/return-policy"),
    applicableCountry: "US",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: RETURN_DAYS,
    returnMethod: "https://schema.org/ReturnInStore",
    returnFees: "https://schema.org/FreeReturn",
    refundType: "https://schema.org/FullRefund",
  },
};

function ReturnPolicy() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(returnPolicyJsonLd) }} />
      <PageHeader
        eyebrow="Legal"
        title="Return & Refund Policy"
        description={`Buy with confidence: every RV from ${DEALER.name} comes with a ${RETURN_DAYS}-day return window. Last updated: November 2026`}
      />
      <section className="container-page max-w-3xl py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {SUMMARY.map(({ icon: Icon, label, copy }) => (
            <div key={label} className="rounded-lg border border-border bg-surface p-5">
              <Icon className="h-6 w-6 text-accent" />
              <h2 className="mt-3 font-display font-bold">{label}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-lg font-bold">{section.title}</h2>
              {section.body ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
              ) : null}
              {section.points ? (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}

          <div>
            <h2 className="font-display text-lg font-bold">Warranty</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Returns are separate from warranty coverage. Manufacturer warranties on new RVs and any written warranty
              on a used RV are described in our{" "}
              <Link to="/terms" className="text-accent hover:underline">
                Terms &amp; Conditions
              </Link>{" "}
              and your purchase agreement.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold">Contact</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Questions about a return or refund? Call{" "}
              <a href={DEALER.phoneHref} className="text-accent hover:underline">
                {DEALER.phone}
              </a>
              , email{" "}
              <a href={`mailto:${DEALER.email}`} className="text-accent hover:underline">
                {DEALER.email}
              </a>{" "}
              or write to {DEALER.name}, {DEALER.address}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
