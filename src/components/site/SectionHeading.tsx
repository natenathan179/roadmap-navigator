import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div
      className={`flex flex-col gap-4 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}
    >
      <div className={centered ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
        ) : null}
        <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">{title}</h2>
        {description ? <p className="mt-3 text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
