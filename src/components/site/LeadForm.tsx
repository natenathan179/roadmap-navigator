import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLead, type LeadTable } from "@/lib/leads";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "date" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  full?: boolean;
};

type Props = {
  table: LeadTable;
  fields: FieldDef[];
  submitLabel: string;
  successMessage: string;
  defaults?: Record<string, string>;
  hidden?: Record<string, unknown>;
  compact?: boolean;
};

export function LeadForm({
  table,
  fields,
  submitLabel,
  successMessage,
  defaults = {},
  hidden = {},
  compact = false,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const field of fields) initial[field.name] = defaults[field.name] ?? "";
    return initial;
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function set(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    const payload: Record<string, unknown> = { ...hidden };
    for (const field of fields) {
      const raw = values[field.name]?.trim() ?? "";
      if (!raw) {
        if (field.required) {
          toast.error(`${field.label} is required.`);
          setSubmitting(false);
          return;
        }
        continue;
      }
      payload[field.name] = field.type === "number" ? Number(raw.replace(/[^0-9.]/g, "")) : raw;
    }

    const result = await submitLead(table, payload);
    setSubmitting(false);

    if (!result.ok) {
      toast.error("We couldn't send that. Please call us and we'll take the details by phone.");
      return;
    }
    toast.success(successMessage);
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-lg border border-accent/30 bg-accent/5 p-8 text-center">
        <h3 className="font-display text-lg font-bold text-foreground">Request received</h3>
        <p className="mt-2 text-sm text-muted-foreground">{successMessage}</p>
        <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
      {fields.map((field) => (
        <div key={field.name} className={!compact && (field.full || field.type === "textarea") ? "sm:col-span-2" : ""}>
          <Label htmlFor={field.name}>
            {field.label}
            {field.required ? <span className="text-destructive"> *</span> : null}
          </Label>
          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              rows={4}
              className="mt-1.5"
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(e) => set(field.name, e.target.value)}
            />
          ) : field.type === "select" ? (
            <select
              id={field.name}
              className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              value={values[field.name] ?? ""}
              onChange={(e) => set(field.name, e.target.value)}
            >
              <option value="">Select…</option>
              {(field.options ?? []).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id={field.name}
              type={field.type === "number" ? "text" : (field.type ?? "text")}
              inputMode={field.type === "number" ? "numeric" : undefined}
              className="mt-1.5"
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(e) => set(field.name, e.target.value)}
            />
          )}
        </div>
      ))}
      <div className={compact ? "" : "sm:col-span-2"}>
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
