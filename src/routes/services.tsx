import { createFileRoute } from "@tanstack/react-router";
import { Wrench } from "lucide-react";

import { LeadForm } from "@/components/site/LeadForm";
import { PageHeader } from "@/components/site/PageHeader";
import { SERVICE_CATEGORIES } from "@/lib/dealership";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "RV Service &amp; Inspection | Summit Ridge RV, Bend Oregon" },
      {
        name: "description",
        content:
          "RV inspection, preventive maintenance, generator, electrical, HVAC, plumbing, roof, detailing and winterization service in Bend, Oregon. Schedule your motorhome service.",
      },
      { property: "og:title", content: "RV Service & Inspection | Summit Ridge RV" },
      {
        property: "og:description",
        content: "An in-house service department that works on coaches every day, not once in a while.",
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Service Department"
        title="Keep your coach on the road"
        description="Pre-purchase inspections, seasonal maintenance and full mechanical work — handled by technicians who specialize in motorhomes."
      />

      <section className="container-page py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((service) => (
            <div
              key={service.name}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-5 shadow-card"
            >
              <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <h2 className="font-display text-sm font-bold">{service.name}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="container-page max-w-3xl">
          <h2 className="font-display text-2xl font-bold">Schedule service</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us what the coach needs and when you'd like to bring it in. We'll confirm a bay.
          </p>
          <div className="mt-8 rounded-lg border border-border bg-card p-7 shadow-card">
            <LeadForm
              table="service_requests"
              submitLabel="Schedule Service"
              successMessage="Service request received. We'll confirm your appointment by phone."
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel" },
                { name: "preferred_date", label: "Preferred date", type: "date" },
                {
                  name: "service_type",
                  label: "Service needed",
                  type: "select",
                  options: SERVICE_CATEGORIES.map((s) => s.name),
                  required: true,
                  full: true,
                },
                { name: "rv_details", label: "Year, make and model of your RV", full: true },
                { name: "message", label: "Describe the issue", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
