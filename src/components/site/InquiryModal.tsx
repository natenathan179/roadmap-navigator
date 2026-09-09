import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { money, type Rv } from "@/lib/inventory";
import { submitLead } from "@/lib/leads";
import type { CartItem } from "@/lib/cart";

export type InquiryKind = "information" | "viewing" | "checkout";

type Props = {
  open: boolean;
  onClose: () => void;
  kind: InquiryKind;
  rv?: Rv | null;
  items?: CartItem[];
  onSuccess?: () => void;
};

const TITLES: Record<InquiryKind, string> = {
  information: "Request Price & Availability",
  viewing: "Schedule a Viewing",
  checkout: "Request Your Quote",
};

export function InquiryModal({ open, onClose, kind, rv, items, onSuccess }: Props) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    preferred_date: "",
    message: "",
  });
  const [financing, setFinancing] = useState(false);
  const [tradeIn, setTradeIn] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const cart = items ?? [];
  const cartTotal = cart.reduce((sum, i) => sum + (i.price || 0), 0);
  const set = (k: keyof typeof values, v: string) => setValues((p) => ({ ...p, [k]: v }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.name.trim() || !values.email.trim()) {
      toast.error("Please add your name and email so we can reply.");
      return;
    }
    setSending(true);

    let result;
    if (kind === "checkout") {
      result = await submitLead(
        "quote_requests",
        {
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          city: values.city || null,
          state: values.state || null,
          financing_interest: financing,
          trade_in: tradeIn,
          message: values.message || null,
          items: cart.map((i) => ({
            stock_number: i.stock_number,
            title: i.title,
            price: i.price,
            slug: i.slug,
          })),
          total: cartTotal,
        },
        { "Estimated total": money(cartTotal), Units: cart.map((i) => `${i.title} (#${i.stock_number})`).join(" | ") },
      );
    } else {
      result = await submitLead(
        "inquiries",
        {
          kind,
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          rv_id: rv?.id ?? null,
          rv_of_interest: rv ? `${rv.year} ${rv.make} ${rv.model} (Stock #${rv.stock_number})` : null,
          preferred_date: values.preferred_date || null,
          message: values.message || null,
        },
        rv
          ? {
              "Listed price": money(rv.price),
              VIN: rv.vin ?? "—",
              "Unit type": `${rv.condition} ${rv.rv_class}`,
              Location: rv.location,
            }
          : {},
      );
    }

    setSending(false);
    if (!result.ok) {
      toast.error("We couldn't send that. Please call us and we'll take your details by phone.");
      return;
    }
    toast.success("Request sent — we'll reply the same business day.");
    setDone(true);
    onSuccess?.();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-foreground/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={TITLES[kind]}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-background p-6 shadow-lift sm:rounded-xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="font-display text-xl font-bold">{TITLES[kind]}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          No obligation. A product specialist replies with pricing, availability and delivery options.
        </p>

        {rv ? (
          <div className="mt-5 flex gap-4 rounded-lg border border-border bg-surface p-4">
            <img
              src={rv.photos[0] ?? "/rv/hero.jpg"}
              alt={rv.photo_alts[0] ?? `${rv.year} ${rv.make} ${rv.model} for sale`}
              className="h-20 w-28 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0 text-sm">
              <p className="font-display font-bold leading-snug">
                {rv.year} {rv.make} {rv.model}
              </p>
              <p className="mt-1 text-muted-foreground">
                Stock #{rv.stock_number} · {rv.condition} {rv.rv_class} · Sleeps {rv.sleeps ?? "—"} ·{" "}
                {rv.length_ft ? `${rv.length_ft} ft` : "—"}
              </p>
              <p className="mt-1 font-semibold text-accent">{money(rv.price)}</p>
            </div>
          </div>
        ) : null}

        {kind === "checkout" && cart.length ? (
          <div className="mt-5 rounded-lg border border-border bg-surface p-4 text-sm">
            <p className="font-display font-bold">Your quote list ({cart.length})</p>
            <ul className="mt-2 space-y-1.5">
              {cart.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 text-muted-foreground">
                  <span className="truncate">
                    {i.title} <span className="text-xs">#{i.stock_number}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-foreground">{money(i.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-border pt-3 font-display font-bold">
              <span>Estimated total</span>
              <span>{money(cartTotal)}</span>
            </div>
          </div>
        ) : null}

        {done ? (
          <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-6 text-center">
            <h3 className="font-display text-lg font-bold">Request received</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks {values.name.split(" ")[0]} — we've emailed your request to our sales team and will be in touch
              shortly.
            </p>
            <Button className="mt-5" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="im-name">
                Full name<span className="text-destructive"> *</span>
              </Label>
              <Input id="im-name" className="mt-1.5" value={values.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="im-email">
                Email<span className="text-destructive"> *</span>
              </Label>
              <Input
                id="im-email"
                type="email"
                className="mt-1.5"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="im-phone">Phone</Label>
              <Input
                id="im-phone"
                type="tel"
                className="mt-1.5"
                value={values.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </div>
            {kind === "checkout" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="im-city">City</Label>
                  <Input id="im-city" className="mt-1.5" value={values.city} onChange={(e) => set("city", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="im-state">State</Label>
                  <Input
                    id="im-state"
                    className="mt-1.5"
                    value={values.state}
                    onChange={(e) => set("state", e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="im-date">{kind === "viewing" ? "Preferred viewing date" : "Best day to reach you"}</Label>
                <Input
                  id="im-date"
                  type="date"
                  className="mt-1.5"
                  value={values.preferred_date}
                  onChange={(e) => set("preferred_date", e.target.value)}
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <Label htmlFor="im-message">Message</Label>
              <Textarea
                id="im-message"
                rows={4}
                className="mt-1.5"
                placeholder={
                  kind === "checkout"
                    ? "Tell us about your tow vehicle, timeline or delivery address."
                    : "Ask about condition, options, payments or delivery."
                }
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
              />
            </div>
            {kind === "checkout" ? (
              <div className="flex flex-wrap gap-5 text-sm sm:col-span-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={financing} onChange={(e) => setFinancing(e.target.checked)} />
                  I'd like financing options
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={tradeIn} onChange={(e) => setTradeIn(e.target.checked)} />
                  I have a trade-in
                </label>
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <Button type="submit" size="lg" disabled={sending} className="w-full">
                {sending ? "Sending…" : kind === "checkout" ? "Send Quote Request" : TITLES[kind]}
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Submitting sends your details to our sales team by email. No payment is taken online — every unit is
                sold through a written quote.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
