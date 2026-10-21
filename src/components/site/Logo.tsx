import { useId } from "react";

import { cn } from "@/lib/utils";

/** Brand mark: chrome italic "RV" with a road running through the V. Mirrors public/favicon.svg and public/logo.svg. */
export function LogoMark({ className }: { className?: string }) {
  // Header and footer both render the mark, so gradient/mask ids must be unique per instance.
  const id = useId().replace(/:/g, "");
  const chrome = `chrome-${id}`;
  const road = `road-${id}`;

  return (
    <svg viewBox="0 0 90 40" aria-hidden="true" className={cn("h-7 w-auto shrink-0", className)}>
      <defs>
        <linearGradient id={chrome} x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".42" stopColor="#D5DADF" />
          <stop offset=".5" stopColor="#9AA2AA" />
          <stop offset=".62" stopColor="#C3C9CF" />
          <stop offset="1" stopColor="#EEF1F3" />
        </linearGradient>
        <mask id={road} maskUnits="userSpaceOnUse" x="0" y="0" width="90" height="40">
          <rect width="90" height="40" fill="#fff" />
          <path d="M51 41C58 31 67 15 79 -1" fill="none" stroke="#000" strokeWidth="2.4" />
          <path d="M58.5 41C63 33 70 20 80 6" fill="none" stroke="#000" strokeWidth="1.2" strokeDasharray="3 2.4" />
        </mask>
      </defs>
      <g mask={`url(#${road})`}>
        <g transform="translate(10 0) skewX(-14)" fill={`url(#${chrome})`}>
          <path
            fillRule="evenodd"
            d="M0 0H26C33 0 37 4 37 11C37 17 34 21 28 22.5L36 40H25L18 24H10V40H0ZM10 8H25C27 8 28 9 28 11.5C28 14 27 15.5 25 15.5H10Z"
          />
          <path d="M39 0H50.5L58 24L66 0H78L63 40H52Z" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Full logo lockup for dark (navy) surfaces: "RV" mark + "MOTORHOMES" wordmark + tagline (sm and up).
 * `stacked` puts the mark above the wordmark, like the original logo, for narrow columns such as the footer.
 */
export function Logo({ stacked = false, className }: { stacked?: boolean; className?: string }) {
  return (
    <span className={cn("flex", stacked ? "flex-col items-start gap-2" : "items-center gap-2.5", className)}>
      <LogoMark className={stacked ? "h-10" : undefined} />
      <span className="leading-none">
        <span className="block whitespace-nowrap bg-gradient-to-b from-white via-[#C3C9CF] to-[#EEF1F3] bg-clip-text font-display text-[15px] font-extrabold uppercase tracking-[0.16em] text-transparent">
          MotorHomes
        </span>
        <span className="mt-1.5 hidden whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.14em] text-navy-foreground/65 sm:block">
          Freedom · Adventure · Your Way
        </span>
      </span>
    </span>
  );
}
