import { Link, createFileRoute } from "@tanstack/react-router";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";

import { InquiryModal } from "@/components/site/InquiryModal";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/inventory";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your RV Quote List | Summit Ridge RV Bend, Oregon" },
      {
        name: "description",
        content:
          "Review the motorhomes and travel trailers on your quote list and send one request for out-the-door pricing, financing options and delivery costs.",
      },
      { property: "og:title", content: "Your RV Quote List | Summit Ridge RV" },
      {
        property: "og:description",
        content: "Send a single enquiry covering every RV you're considering — pricing, financing and delivery.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Quote List"
        title="Your RV quote list"
        description="Shortlist as many units as you like, then send one request. We reply with out-the-door pricing, payment estimates and delivery costs for every unit."
      />

      <section className="container-page py-14">
        {cart.items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-14 text-center">
            <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 font-display text-xl font-bold">Your quote list is empty</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Browse our travel trailers, fifth wheels and motorhomes and add any unit to your list to compare pricing
              side by side.
            </p>
            <Button asChild className="mt-6">
              <Link to="/inventory">Browse RV inventory</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-card sm:flex-row"
                >
                  <Link to="/inventory/$slug" params={{ slug: item.slug }} className="sm:w-48">
                    <img
                      src={item.photo ?? "/rv/hero.jpg"}
                      alt={`${item.title} for sale at Summit Ridge RV`}
                      loading="lazy"
                      className="aspect-[3/2] w-full rounded-md object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <h2 className="font-display text-lg font-bold leading-snug">
                      <Link to="/inventory/$slug" params={{ slug: item.slug }} className="hover:text-accent">
                        {item.title}
                      </Link>
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">Stock #{item.stock_number}</p>
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <p className="font-display text-xl font-bold text-primary">{money(item.price)}</p>
                      <button
                        type="button"
                        onClick={() => cart.remove(item.id)}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <div className="rounded-lg border border-border bg-card p-6 shadow-lift">
                <h2 className="font-display text-lg font-bold">Quote summary</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Units</dt>
                    <dd className="font-semibold">{cart.count}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-3">
                    <dt className="text-muted-foreground">Listed total</dt>
                    <dd className="font-display text-xl font-bold">{money(cart.total)}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">
                  Listed prices exclude tax, title, registration and delivery. No payment is taken online — checkout
                  sends a written quote request to our sales team.
                </p>
                <Button className="mt-5 w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setOpen(true)}>
                  Request Quote for {cart.count} {cart.count === 1 ? "Unit" : "Units"}
                </Button>
                <Button variant="outline" className="mt-2 w-full" onClick={cart.clear}>
                  Clear list
                </Button>
              </div>
            </aside>
          </div>
        )}
      </section>

      <InquiryModal
        open={open}
        onClose={() => setOpen(false)}
        kind="checkout"
        items={cart.items}
        onSuccess={cart.clear}
      />
    </>
  );
}
