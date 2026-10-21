import { cn } from "@/lib/utils";

/** Brand mark: Cascade peaks with the open road leading toward them. Mirrors public/favicon.svg. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("h-9 w-9 shrink-0", className)}>
      <rect width="40" height="40" rx="9" className="fill-accent" />
      <path d="M3 27 15 8l6 9 5-6 11 16Z" className="fill-navy" />
      <path d="M15 8l3.67 5.5-1.97-1.1-1.7 1.8-1.7-1.8-1.77 1.1Z" fill="#fff" />
      <path d="M26 11l2.41 3.5-1.31-.8-1.1 1.2-1.3-1.2-1.62.8Z" fill="#fff" />
      <path d="M19.4 27c1.8 4-7.9 7-9.4 13h18c-7.5-6-5.2-9-7.4-13Z" fill="#fff" />
      <path
        d="M20 27.8c1.6 3.4-4.2 6.4-.8 12.2"
        fill="none"
        className="stroke-accent"
        strokeWidth="1.1"
        strokeDasharray="1.8 1.6"
      />
    </svg>
  );
}

/** Full logo lockup for dark (navy) surfaces: mark + "SUMMIT RIDGE RV" wordmark + optional subtitle. */
export function Logo({ subtitle, className }: { subtitle?: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      <span className="leading-tight">
        <span className="block font-display text-base font-extrabold uppercase tracking-[0.06em]">
          Summit Ridge <span className="text-accent">RV</span>
        </span>
        {subtitle ? (
          <span className="hidden text-[10px] uppercase tracking-[0.18em] text-navy-foreground/60 sm:block">
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}
