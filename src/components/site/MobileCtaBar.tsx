import { Link } from "@tanstack/react-router";
import { BadgeDollarSign, Phone } from "lucide-react";

import { DEALER } from "@/lib/dealership";

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <a
        href={DEALER.phoneHref}
        className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-primary"
      >
        <Phone className="h-4 w-4" />
        Call Now
      </a>
      <Link
        to="/financing"
        className="flex items-center justify-center gap-2 bg-accent py-3.5 text-sm font-semibold text-accent-foreground"
      >
        <BadgeDollarSign className="h-4 w-4" />
        Get Financing
      </Link>
    </div>
  );
}
