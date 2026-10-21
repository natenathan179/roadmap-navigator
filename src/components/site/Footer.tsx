import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/site/Logo";
import { DEALER } from "@/lib/dealership";

const COLUMNS = [
  {
    title: "Inventory",
    links: [
      { to: "/inventory", label: "All RVs" },
      { to: "/new-rvs", label: "New RVs" },
      { to: "/used-rvs", label: "Used RVs" },
      { to: "/reviews", label: "Customer Reviews" },
    ],
  },
  {
    title: "Buy & Sell",
    links: [
      { to: "/financing", label: "RV Financing" },
      { to: "/trade-in", label: "Trade In Your RV" },
      { to: "/delivery", label: "Delivery & Pickup" },
      { to: "/guides", label: "RV Buying Guide" },
    ],
  },
  {
    title: "Dealership",
    links: [
      { to: "/about", label: "About Us" },
      { to: "/services", label: "Service Department" },
      { to: "/contact", label: "Contact" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-20 bg-navy text-navy-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo stacked />
          <p className="mt-4 text-sm leading-relaxed text-navy-foreground/70">
            New and pre-owned travel trailers, fifth wheels and motorhomes, full-service RV repair and nationwide delivery from the heart of
            Michigan.
          </p>
          <div className="mt-5 space-y-2 text-sm text-navy-foreground/80">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {DEALER.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a href={DEALER.phoneHref} className="hover:text-accent">
                {DEALER.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${DEALER.email}`} className="min-w-0 wrap-anywhere hover:text-accent">
                {DEALER.email}
              </a>
            </p>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.18em] text-accent">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-navy-foreground/75 transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-navy-foreground/55 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {DEALER.name}. All rights reserved.
          </p>
          <p>
            Financing is subject to lender approval and terms. Prices exclude tax, title, license and dealer
            documentation fees.
          </p>
        </div>
      </div>
    </footer>
  );
}
