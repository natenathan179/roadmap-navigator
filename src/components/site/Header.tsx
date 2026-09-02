import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { DEALER } from "@/lib/dealership";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/inventory", label: "RV Inventory" },
  { to: "/new-rvs", label: "New RVs" },
  { to: "/used-rvs", label: "Used RVs" },
  { to: "/financing", label: "Financing" },
  { to: "/services", label: "Service" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy text-navy-foreground shadow-lift">
      <div className="hidden border-b border-white/10 lg:block">
        <div className="container-page flex h-9 items-center justify-between text-xs text-navy-foreground/70">
          <span>{DEALER.address}</span>
          <div className="flex items-center gap-5">
            <span>Mon–Fri 8–6 · Sat 9–5</span>
            <a href={DEALER.phoneHref} className="font-semibold text-navy-foreground hover:text-accent">
              {DEALER.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-accent font-display text-sm font-bold text-accent-foreground">
            SR
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold tracking-tight">{DEALER.name}</span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-navy-foreground/60 sm:block">
              Bend, Oregon
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-accent" }}
              inactiveProps={{ className: "text-navy-foreground/80" }}
              activeOptions={{ exact: item.to === "/" }}
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={DEALER.phoneHref}
            className="hidden items-center gap-2 text-sm font-semibold hover:text-accent md:flex"
          >
            <Phone className="h-4 w-4" />
            {DEALER.phone}
          </a>
          <Button asChild className="hidden bg-accent text-accent-foreground hover:bg-accent/90 sm:inline-flex">
            <Link to="/inventory">View Inventory</Link>
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-navy xl:hidden">
          <div className="container-page grid gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-accent" }}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-navy-foreground/90 hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/trade-in"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-sm font-medium text-navy-foreground/90 hover:bg-white/5"
            >
              Value My Trade
            </Link>
            <Link
              to="/guides"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-sm font-medium text-navy-foreground/90 hover:bg-white/5"
            >
              RV Buying Guide
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
