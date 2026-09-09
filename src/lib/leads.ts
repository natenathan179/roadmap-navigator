import { supabase } from "@/integrations/supabase/client";
import { DEALER } from "@/lib/dealership";

export type LeadTable =
  | "inquiries"
  | "financing_applications"
  | "trade_in_requests"
  | "service_requests"
  | "delivery_quotes"
  | "quote_requests";

const LABELS: Record<LeadTable, string> = {
  inquiries: "Website Enquiry",
  financing_applications: "Financing Application",
  trade_in_requests: "Trade-In Valuation Request",
  service_requests: "Service Booking Request",
  delivery_quotes: "Delivery Quote Request",
  quote_requests: "Quote Cart Checkout",
};

function pretty(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Emails the lead through FormSubmit and stores a copy in the dealership database. */
export async function submitLead(
  table: LeadTable,
  payload: Record<string, unknown>,
  extraEmailFields: Record<string, unknown> = {},
): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.from(table).insert(payload as never);

  const emailBody: Record<string, unknown> = {
    _subject: `${LABELS[table]} — ${DEALER.name}`,
    _template: "table",
    _captcha: "false",
    "Request type": LABELS[table],
  };
  for (const [key, value] of Object.entries({ ...payload, ...extraEmailFields })) {
    if (value === undefined || value === null || value === "") continue;
    emailBody[pretty(key)] = typeof value === "object" ? JSON.stringify(value) : value;
  }

  let emailed = false;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(DEALER.formEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(emailBody),
    });
    emailed = res.ok;
  } catch {
    emailed = false;
  }

  if (error && !emailed) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
