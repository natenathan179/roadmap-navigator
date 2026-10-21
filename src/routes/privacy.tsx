import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/site/PageHeader";
import { DEALER } from "@/lib/dealership";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | RV MotorHomes Dealership" },
      {
        name: "description",
        content:
          "How RV MotorHomes Dealership collects, uses, stores and protects the personal information you submit through our inventory, financing and service forms.",
      },
      { property: "og:title", content: "Privacy Policy | RV MotorHomes Dealership" },
      { property: "og:description", content: "How we handle and protect your personal information." },
    ],
  }),
  component: Privacy,
});

const SECTIONS = [
  {
    title: "Information we collect",
    body: "We collect the information you voluntarily submit through our inquiry, financing, trade-in, service and delivery forms — typically your name, email address, phone number, mailing address and details about the RV you own or want. Financing applications additionally collect employment and income information needed to submit your application to lenders.",
  },
  {
    title: "How we use it",
    body: "We use your information to respond to your request, prepare quotes and appraisals, submit financing applications to lenders on your behalf, schedule service, and follow up about inventory that matches what you asked for. We do not sell your personal information.",
  },
  {
    title: "Sharing with third parties",
    body: "Financing applications are shared only with lenders you have asked us to submit to. Delivery requests may be shared with licensed transport carriers. Service records may be shared with manufacturers when processing warranty claims. We do not otherwise disclose your information except where required by law.",
  },
  {
    title: "Data security",
    body: "Form submissions are transmitted over HTTPS and stored in an access-controlled database. Access is limited to dealership staff who need it to do their job. No transmission over the internet is completely secure, so please do not send full Social Security numbers or bank account details through website forms.",
  },
  {
    title: "Cookies and analytics",
    body: "We use essential cookies to keep the site working and may use aggregate analytics to understand which pages and listings are useful. You can block cookies in your browser; the site will still function.",
  },
  {
    title: "Your choices",
    body: "You can ask us to correct or delete the information you submitted, or unsubscribe from follow-up at any time, by emailing us. We will honor verified requests promptly.",
  },
];

function Privacy() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="Last updated: January 2026" />
      <section className="container-page max-w-3xl space-y-8 py-14">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display text-lg font-bold">{section.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
          </div>
        ))}
        <div>
          <h2 className="font-display text-lg font-bold">Contact</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Questions about this policy? Email{" "}
            <a href={`mailto:${DEALER.email}`} className="text-accent hover:underline">
              {DEALER.email}
            </a>{" "}
            or write to {DEALER.name}, {DEALER.address}.
          </p>
        </div>
      </section>
    </>
  );
}
