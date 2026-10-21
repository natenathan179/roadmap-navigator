import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { LeadForm } from "@/components/site/LeadForm";
import { PageHeader } from "@/components/site/PageHeader";
import { DEALER } from "@/lib/dealership";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact RV MotorHomes Dealership | Motorhome Dealership in Bend, Oregon" },
      {
        name: "description",
        content:
          "Call, email or visit RV MotorHomes Dealership in Bend, Oregon. Sales and service hours, directions and a direct inquiry form for any motorhome in our inventory.",
      },
      { property: "og:title", content: "Contact RV MotorHomes Dealership" },
      {
        property: "og:description",
        content: "Hours, directions and a direct line to our sales and service teams in Bend, Oregon.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Talk to a real person"
        description="No call centers and no bots — you'll reach the same people who walk the lot every day."
      />

      <section className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <dl className="space-y-6 text-sm">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <dt className="font-display font-bold">Dealership</dt>
                <dd className="mt-1 text-muted-foreground">{DEALER.address}</dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <dt className="font-display font-bold">Phone</dt>
                <dd className="mt-1">
                  <a href={DEALER.phoneHref} className="text-muted-foreground hover:text-accent">
                    {DEALER.phone}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <dt className="font-display font-bold">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${DEALER.email}`} className="wrap-anywhere text-muted-foreground hover:text-accent">
                    {DEALER.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div>
                <dt className="font-display font-bold">Hours</dt>
                <dd className="mt-1 space-y-1 text-muted-foreground">
                  {DEALER.hours.map((row) => (
                    <div key={row.days} className="flex gap-3">
                      <span className="w-32 shrink-0">{row.days}</span>
                      <span>{row.time}</span>
                    </div>
                  ))}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-8 overflow-hidden rounded-lg border border-border shadow-card">
            <iframe
              title={`Map to ${DEALER.name}`}
              src={`https://www.google.com/maps?q=${DEALER.mapQuery}&output=embed`}
              width="100%"
              height="320"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-7 shadow-card">
          <h2 className="font-display text-xl font-bold">Send an inquiry</h2>
          <p className="mt-1 text-sm text-muted-foreground">We answer every message the same business day.</p>
          <div className="mt-6">
            <LeadForm
              table="inquiries"
              hidden={{ kind: "contact" }}
              submitLabel="Send Inquiry"
              successMessage="Message sent. We'll be in touch shortly."
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "phone", label: "Phone", type: "tel" },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "rv_of_interest", label: "RV of interest" },
                { name: "message", label: "Message", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
