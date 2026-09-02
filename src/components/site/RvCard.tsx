import { Link } from "@tanstack/react-router";
import { Gauge, Ruler, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { miles, money, rvTitle, type Rv } from "@/lib/inventory";

export function RvCard({ rv }: { rv: Rv }) {
  const sold = rv.status === "sold";
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-lift">
      <Link
        to="/inventory/$stock"
        params={{ stock: rv.stock_number }}
        className="relative block aspect-[3/2] overflow-hidden bg-surface"
      >
        <img
          src={rv.photos[0] ?? "/rv/class-a-ext.jpg"}
          alt={`${rvTitle(rv)} ${rv.rv_class} motorhome for sale`}
          loading="lazy"
          width={1600}
          height={1067}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className="bg-navy text-navy-foreground capitalize hover:bg-navy">{rv.condition}</Badge>
          {rv.featured && !sold ? (
            <Badge className="bg-accent text-accent-foreground hover:bg-accent">Featured</Badge>
          ) : null}
          {sold ? <Badge variant="destructive">Sold</Badge> : null}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">{rv.rv_class}</p>
        <h3 className="mt-1.5 font-display text-lg font-bold leading-snug">
          <Link to="/inventory/$stock" params={{ stock: rv.stock_number }} className="hover:text-accent">
            {rvTitle(rv)}
          </Link>
        </h3>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-y border-border py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-accent" />
            <span>{miles(rv.mileage)} mi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-accent" />
            <span>Sleeps {rv.sleeps ?? "—"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5 text-accent" />
            <span>{rv.length_ft ?? "—"} ft</span>
          </div>
        </dl>

        <div className="mt-4 flex flex-1 items-end justify-between gap-3">
          <div>
            <p className="font-display text-2xl font-bold text-primary">{money(rv.price)}</p>
            <p className="text-xs text-muted-foreground">Stock #{rv.stock_number}</p>
          </div>
          <Link
            to="/inventory/$stock"
            params={{ stock: rv.stock_number }}
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View RV
          </Link>
        </div>
      </div>
    </article>
  );
}
