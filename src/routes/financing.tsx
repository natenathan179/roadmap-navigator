import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { LeadForm } from "@/components/site/LeadForm";

export const Route = createFileRoute("/financing")({
  head: () => ({
    meta: [
      { title: "RV Financing | Apply for a Motorhome Loan | RV MotorHomes Dealership" },
      {
        name: "description",
        content:
          "Apply for RV financing at RV MotorHomes Dealership. Terms from 10 to 20 years, full-timer programs and competitive rates through multiple motorhome lenders.",
      },
      { property: "og:title", content: "RV Financing | RV MotorHomes Dealership" },
      {
        property: "og:description",
        content: "One application, multiple RV lenders. Get pre-qualified for your motorhome.",
      },
    ],
  }),
  component: Financing,
});

const STEPS = [
  { title: "Submit your application", copy: "Five minutes online. A soft look first — no impact to your score." },
  { title: "We shop your file", copy: "We send it to marine and RV lenders who specialize in motorhome paper." },
  { title: "Review your options", copy: "You get real terms, rates and monthly payments side by side." },
  { title: "Sign and hit the road", copy: "Paperwork completed at the dealership or shipped to your door." },
];

function Financing() {
  return (
    <>
      <PageHeader
        eyebrow="RV Financing"
        title="Make Your RV Dreams a Reality"
        description="RV loans work differently than car loans — longer terms, larger amounts and lenders who actually understand coaches. We handle that for you."
      />

      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <h2 className="font-display text-2xl font-bold">How it works</h2>
          <ol className="mt-8 space-y-7">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy font-display text-sm font-bold text-navy-foreground">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-lg bg-surface p-6">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.14em]">Typical programs</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>10–20 year terms depending on loan amount and coach age</li>
              <li>10–20% down on most motorhome loans</li>
              <li>Full-timer programs for buyers living in the coach</li>
              <li>Trade equity can be applied directly to your down payment</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-7 shadow-card">
          <h2 className="font-display text-xl font-bold">Apply for financing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All fields marked with an asterisk are required. Your information is transmitted securely.
          </p>
          <div className="mt-6">
            <LeadForm
              table="financing_applications"
              submitLabel="Apply for Financing"
              successMessage="Application received. A finance manager will contact you within one business day."
              fields={[
                { name: "name", label: "Full name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel", required: true },
                { name: "address", label: "Home address", full: true },
                { name: "employment", label: "Employment status" },
                { name: "annual_income", label: "Annual income ($)", type: "number" },
                { name: "desired_rv", label: "Desired RV" },
                { name: "down_payment", label: "Down payment ($)", type: "number" },
                {
                  name: "credit_range",
                  label: "Estimated credit range",
                  type: "select",
                  options: ["Excellent (740+)", "Good (700–739)", "Fair (640–699)", "Challenged (below 640)"],
                },
                { name: "notes", label: "Anything else we should know?", type: "textarea" },
              ]}
            />
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Financing is subject to lender approval. Rates, terms and down payment requirements vary based on
            creditworthiness, loan amount, coach age and lender program. Submitting this form is not a commitment to
            lend and does not guarantee approval.
          </p>
        </div>
      </section>
    </>
  );
}
