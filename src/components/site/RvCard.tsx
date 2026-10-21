import { Link } from "@tanstack/react-router";
import { BedDouble, Plus, Ruler, Weight } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart";
import { miles, money, rvTitle, type Rv } from "@/lib/inventory";

export function RvCard({ rv }: { rv: Rv }) {
  const sold = rv.status === "sold";
  const cart = useCart();
  const inCart = cart.items.some((i) => i.id === rv.id);
  const title = rvTitle(rv);

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card transition-shadow hover:shadow-lift">
      <Link
        to="/inventory/$slug"
        params={{ slug: rv.slug }}
        className="relative block aspect-[3/2] overflow-hidden bg-surface"
      >
        <img
          src={rv.photos[0] ?? "/rv/hero.jpg"}
          alt={rv.photo_alts[0] ?? `${title} ${rv.rv_class} for sale in Michigan`}
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
          <Link to="/inventory/$slug" params={{ slug: rv.slug }} className="hover:text-accent">
            {title}
          </Link>
        </h3>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-y border-border py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BedDouble className="h-3.5 w-3.5 text-accent" />
            <span>Sleeps {rv.sleeps ?? "—"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5 text-accent" />
            <span>{rv.length_ft ?? "—"} ft</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Weight className="h-3.5 w-3.5 text-accent" />
            <span>{rv.dry_weight ? `${miles(rv.dry_weight)} lb` : "—"}</span>
          </div>
        </dl>

        <div className="mt-4 flex flex-1 items-end justify-between gap-3">
          <div>
            <p className="font-display text-2xl font-bold text-primary">{money(rv.price)}</p>
            <p className="text-xs text-muted-foreground">Stock #{rv.stock_number}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Add ${title} to quote list`}
              onClick={() => {
                const added = cart.add({
                  id: rv.id,
                  slug: rv.slug,
                  title,
                  stock_number: rv.stock_number,
                  price: rv.price,
                  photo: rv.photos[0] ?? null,
                });
                toast[added ? "success" : "info"](
                  added ? "Added to your quote list." : "That RV is already on your quote list.",
                );
              }}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-md border border-border transition-colors ${
                inCart ? "bg-accent/10 text-accent" : "hover:bg-surface"
              }`}
            >
              <Plus className="h-4 w-4" />
            </button>
            <Link
              to="/inventory/$slug"
              params={{ slug: rv.slug }}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              View RV
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
