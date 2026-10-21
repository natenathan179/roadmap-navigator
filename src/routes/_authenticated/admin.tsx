import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, Pencil, Plus, Star, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { CONDITIONS, RV_CLASSES, FUEL_TYPES } from "@/lib/dealership";
import { money, normalize, rvTitle, type Rv } from "@/lib/inventory";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Dealership Admin | RV MotorHomes Dealership" },
      { name: "description", content: "Manage RV inventory, photos, enquiries and reviews." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Dealership Admin | RV MotorHomes Dealership" },
      { property: "og:description", content: "Internal dealership management dashboard." },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  { id: "inventory", label: "Inventory" },
  { id: "inquiries", label: "Enquiries" },
  { id: "quote_requests", label: "Quote Requests" },
  { id: "financing_applications", label: "Financing" },
  { id: "trade_in_requests", label: "Trade-Ins" },
  { id: "service_requests", label: "Service" },
  { id: "delivery_quotes", label: "Delivery" },
  { id: "reviews", label: "Reviews" },
  { id: "blog_posts", label: "Guides" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const BLANK: Record<string, unknown> = {
  slug: "",
  stock_number: "",
  year: new Date().getFullYear(),
  make: "",
  model: "",
  rv_class: "Travel Trailer",
  rv_type: "",
  condition: "new",
  fuel_type: "Towable",
  price: 0,
  msrp: null,
  mileage: 0,
  length_ft: null,
  sleeps: null,
  slides: 0,
  dry_weight: null,
  gvwr: null,
  vin: "",
  location: "Michigan",
  description: "",
  seo_title: "",
  seo_description: "",
  features: [],
  highlights: [],
  photos: [],
  photo_alts: [],
  featured: false,
  status: "available",
  published: true,
};

function slugify(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function AdminPage() {
  const [tab, setTab] = useState<TabId>("inventory");
  const navigate = useNavigate();

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Dealership admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage inventory, photos, leads, reviews and guides.</p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
              tab === t.id ? "bg-navy text-navy-foreground" : "text-muted-foreground hover:bg-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "inventory" ? (
          <InventoryAdmin />
        ) : tab === "reviews" ? (
          <ReviewsAdmin />
        ) : tab === "blog_posts" ? (
          <PostsAdmin />
        ) : (
          <LeadsAdmin table={tab} />
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- Inventory ---------------------------------- */

function InventoryAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "rvs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rvs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => normalize(r as Record<string, unknown>));
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rvs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Listing deleted");
      qc.invalidateQueries({ queryKey: ["admin", "rvs"] });
      qc.invalidateQueries({ queryKey: ["rvs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await supabase.from("rvs").update(values as never).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "rvs"] });
      qc.invalidateQueries({ queryKey: ["rvs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (editing) {
    return <RvEditor initial={editing} onDone={() => setEditing(null)} />;
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{data?.length ?? 0} listings</p>
        <Button onClick={() => setEditing({ ...BLANK })}>
          <Plus className="mr-2 h-4 w-4" /> Add RV
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-3">Unit</th>
                <th className="p-3">Stock #</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Featured</th>
                <th className="p-3">Live</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((rv: Rv) => (
                <tr key={rv.id} className="border-t border-border">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rv.photos[0] ?? "/rv/hero.jpg"}
                        alt=""
                        className="h-10 w-14 rounded object-cover"
                      />
                      <span className="font-semibold">{rvTitle(rv)}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{rv.stock_number}</td>
                  <td className="p-3">{money(rv.price)}</td>
                  <td className="p-3">
                    <select
                      className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                      value={rv.status}
                      onChange={(e) => patch.mutate({ id: rv.id, values: { status: e.target.value } })}
                    >
                      <option value="available">Available</option>
                      <option value="pending">Sale pending</option>
                      <option value="sold">Sold</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={rv.featured}
                      onChange={(e) => patch.mutate({ id: rv.id, values: { featured: e.target.checked } })}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={rv.published}
                      onChange={(e) => patch.mutate({ id: rv.id, values: { published: e.target.checked } })}
                    />
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditing(rv as unknown as Record<string, unknown>)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (confirm(`Delete ${rvTitle(rv)}?`)) remove.mutate(rv.id);
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RvEditor({ initial, onDone }: { initial: Record<string, unknown>; onDone: () => void }) {
  const qc = useQueryClient();
  const [v, setV] = useState<Record<string, unknown>>(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const id = v["id"] as string | undefined;

  const set = (key: string, value: unknown) => setV((p) => ({ ...p, [key]: value }));
  const photos = (v["photos"] as string[]) ?? [];
  const photoAlts = (v["photo_alts"] as string[]) ?? [];

  async function uploadFiles(files: FileList) {
    setUploading(true);
    const folder = (v["slug"] as string) || slugify(`${v["year"]}-${v["make"]}-${v["model"]}`) || "unit";
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("rv-photos").upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });
      if (error) {
        toast.error(`${file.name}: ${error.message}`);
        continue;
      }
      added.push(`/api/public/media/${path}`);
    }
    setUploading(false);
    if (added.length) {
      set("photos", [...photos, ...added]);
      set("photo_alts", [
        ...photoAlts,
        ...added.map(() => `${v["year"]} ${v["make"]} ${v["model"]} for sale in Michigan`),
      ]);
      toast.success(`${added.length} photo${added.length === 1 ? "" : "s"} uploaded`);
    }
  }

  async function save() {
    setSaving(true);
    const payload: Record<string, unknown> = { ...v };
    delete payload["id"];
    delete payload["created_at"];
    delete payload["updated_at"];
    if (!payload["slug"]) payload["slug"] = slugify(`${v["condition"]}-${v["year"]}-${v["make"]}-${v["model"]}`);
    for (const key of ["price", "msrp", "mileage", "length_ft", "sleeps", "slides", "dry_weight", "gvwr", "year"]) {
      const raw = payload[key];
      payload[key] = raw === "" || raw === null || raw === undefined ? null : Number(raw);
    }
    if (payload["year"] === null) payload["year"] = new Date().getFullYear();
    if (payload["price"] === null) payload["price"] = 0;
    if (payload["mileage"] === null) payload["mileage"] = 0;

    const res = id
      ? await supabase.from("rvs").update(payload as never).eq("id", id)
      : await supabase.from("rvs").insert(payload as never);
    setSaving(false);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    toast.success(id ? "Listing updated" : "Listing created");
    qc.invalidateQueries({ queryKey: ["admin", "rvs"] });
    qc.invalidateQueries({ queryKey: ["rvs"] });
    onDone();
  }

  const field = (key: string, label: string, type = "text") => (
    <div>
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        className="mt-1.5"
        value={(v[key] as string | number | null) ?? ""}
        onChange={(e) => set(key, e.target.value)}
      />
    </div>
  );

  const listField = (key: string, label: string) => (
    <div className="sm:col-span-2">
      <Label htmlFor={key}>{label} (one per line)</Label>
      <Textarea
        id={key}
        rows={5}
        className="mt-1.5"
        value={((v[key] as string[]) ?? []).join("\n")}
        onChange={(e) => set(key, e.target.value.split("\n").filter((line) => line.trim() !== ""))}
      />
    </div>
  );

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">{id ? "Edit listing" : "New listing"}</h2>
        <Button variant="ghost" onClick={onDone}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {field("year", "Year", "number")}
        {field("make", "Manufacturer")}
        {field("brand", "Brand")}
        {field("model", "Model")}
        <div>
          <Label htmlFor="rv_class">RV class</Label>
          <select
            id="rv_class"
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={(v["rv_class"] as string) ?? ""}
            onChange={(e) => set("rv_class", e.target.value)}
          >
            {RV_CLASSES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="condition">Condition</Label>
          <select
            id="condition"
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={(v["condition"] as string) ?? "new"}
            onChange={(e) => set("condition", e.target.value)}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="fuel_type">Fuel / drive</Label>
          <select
            id="fuel_type"
            className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={(v["fuel_type"] as string) ?? "Towable"}
            onChange={(e) => set("fuel_type", e.target.value)}
          >
            {FUEL_TYPES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </div>
        {field("stock_number", "Stock number")}
        {field("vin", "VIN")}
        {field("price", "Price (USD)", "number")}
        {field("msrp", "MSRP (USD)", "number")}
        {field("mileage", "Mileage", "number")}
        {field("length_ft", "Length (ft)", "number")}
        {field("sleeps", "Sleeps", "number")}
        {field("slides", "Slides", "number")}
        {field("dry_weight", "Dry weight (lbs)", "number")}
        {field("gvwr", "GVWR (lbs)", "number")}
        {field("location", "Location")}
        {field("slug", "URL slug")}
        {field("seo_title", "SEO title")}
        <div className="sm:col-span-2">
          <Label htmlFor="seo_description">SEO description</Label>
          <Textarea
            id="seo_description"
            rows={2}
            className="mt-1.5"
            value={(v["seo_description"] as string) ?? ""}
            onChange={(e) => set("seo_description", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={8}
            className="mt-1.5"
            value={(v["description"] as string) ?? ""}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
        {listField("highlights", "Highlights")}
        {listField("features", "Features")}
        {listField("photo_alts", "Photo alt text")}

        <div className="sm:col-span-2">
          <Label>Photos</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {photos.map((p, i) => (
              <div key={p} className="relative">
                <img src={p} alt="" className="h-24 w-32 rounded-md object-cover" />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => {
                    set(
                      "photos",
                      photos.filter((_, idx) => idx !== i),
                    );
                    set(
                      "photo_alts",
                      photoAlts.filter((_, idx) => idx !== i),
                    );
                  }}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-semibold hover:bg-surface">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Upload photos"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && uploadFiles(e.target.files)}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-6 text-sm sm:col-span-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={Boolean(v["featured"])} onChange={(e) => set("featured", e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={v["published"] !== false}
              onChange={(e) => set("published", e.target.checked)}
            />
            Published
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={v["status"] === "sold"}
              onChange={(e) => set("status", e.target.checked ? "sold" : "available")}
            />
            Mark as sold
          </label>
        </div>

        <div className="sm:col-span-2">
          <Button onClick={save} disabled={saving || uploading} size="lg">
            {saving ? "Saving…" : id ? "Save changes" : "Create listing"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------ Leads ------------------------------------ */

type LeadTab =
  | "inquiries"
  | "quote_requests"
  | "financing_applications"
  | "trade_in_requests"
  | "service_requests"
  | "delivery_quotes";

function LeadsAdmin({ table }: { table: LeadTab }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });

  const mutate = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> | null }) => {
      const res = values
        ? await supabase.from(table).update(values as never).eq("id", id)
        : await supabase.from(table).delete().eq("id", id);
      if (res.error) throw res.error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", table] }),
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;
  const rows = data ?? [];
  if (!rows.length) return <p className="text-sm text-muted-foreground">No entries yet.</p>;

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <article key={String(row["id"])} className="rounded-lg border border-border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display font-bold">{String(row["name"] ?? "Unnamed")}</h3>
              <p className="text-sm text-muted-foreground">
                {String(row["email"] ?? "")} {row["phone"] ? `· ${String(row["phone"])}` : ""}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {new Date(String(row["created_at"])).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                value={String(row["status"] ?? "new")}
                onChange={(e) => mutate.mutate({ id: String(row["id"]), values: { status: e.target.value } })}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="won">Won</option>
                <option value="closed">Closed</option>
              </select>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (confirm("Delete this entry?")) mutate.mutate({ id: String(row["id"]), values: null });
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <dl className="mt-4 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
            {Object.entries(row)
              .filter(
                ([k, val]) =>
                  !["id", "name", "email", "phone", "status", "created_at"].includes(k) &&
                  val !== null &&
                  val !== "" &&
                  val !== false,
              )
              .map(([k, val]) => (
                <div key={k} className="flex gap-2">
                  <dt className="shrink-0 text-muted-foreground">{k.replace(/_/g, " ")}:</dt>
                  <dd className="font-medium">{typeof val === "object" ? JSON.stringify(val) : String(val)}</dd>
                </div>
              ))}
          </dl>
        </article>
      ))}
    </div>
  );
}

/* ----------------------------------- Reviews ----------------------------------- */

const BLANK_REVIEW: Record<string, unknown> = {
  customer_name: "",
  rating: 5,
  title: "",
  body: "",
  location: "",
  avatar_url: "",
  reviewed_on: new Date().toISOString().slice(0, 10),
  published: true,
};

function ReviewsAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("reviewed_on", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const id = values["id"] as string | undefined;
      const payload = { ...values };
      delete payload["id"];
      delete payload["created_at"];
      payload["rating"] = Number(payload["rating"]) || 5;
      const res = id
        ? await supabase.from("reviews").update(payload as never).eq("id", id)
        : await supabase.from("reviews").insert(payload as never);
      if (res.error) throw res.error;
    },
    onSuccess: () => {
      toast.success("Review saved");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{data?.length ?? 0} reviews</p>
        <Button onClick={() => setDraft({ ...BLANK_REVIEW })}>
          <Plus className="mr-2 h-4 w-4" /> Add review
        </Button>
      </div>

      {draft ? (
        <div className="mb-8 grid gap-4 rounded-lg border border-border p-5 sm:grid-cols-2">
          {(
            [
              ["customer_name", "Customer name"],
              ["title", "Headline"],
              ["location", "Location"],
              ["avatar_url", "Avatar image URL"],
              ["rating", "Rating (1-5)"],
              ["reviewed_on", "Date (YYYY-MM-DD)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label htmlFor={`r-${key}`}>{label}</Label>
              <Input
                id={`r-${key}`}
                className="mt-1.5"
                value={String(draft[key] ?? "")}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Label htmlFor="r-body">Review</Label>
            <Textarea
              id="r-body"
              rows={5}
              className="mt-1.5"
              value={String(draft["body"] ?? "")}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Button onClick={() => save.mutate(draft)}>Save review</Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {(data ?? []).map((r) => (
          <article key={String(r["id"])} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display font-bold">{String(r["customer_name"])}</p>
                <p className="flex items-center gap-1 text-xs text-amber-500">
                  {Array.from({ length: Number(r["rating"]) }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setDraft(r)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => confirm("Delete this review?") && remove.mutate(String(r["id"]))}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{String(r["body"]).slice(0, 180)}…</p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------ Guides ----------------------------------- */

const BLANK_POST: Record<string, unknown> = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  cover_image: "",
  published: true,
  published_at: new Date().toISOString(),
};

function PostsAdmin() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Record<string, unknown>[];
    },
  });

  const save = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const id = values["id"] as string | undefined;
      const payload = { ...values };
      delete payload["id"];
      delete payload["created_at"];
      delete payload["updated_at"];
      if (!payload["slug"]) payload["slug"] = slugify(String(payload["title"] ?? ""));
      const res = id
        ? await supabase.from("blog_posts").update(payload as never).eq("id", id)
        : await supabase.from("blog_posts").insert(payload as never);
      if (res.error) throw res.error;
    },
    onSuccess: () => {
      toast.success("Guide saved");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{data?.length ?? 0} guides</p>
        <Button onClick={() => setDraft({ ...BLANK_POST })}>
          <Plus className="mr-2 h-4 w-4" /> Add guide
        </Button>
      </div>

      {draft ? (
        <div className="mb-8 grid gap-4 rounded-lg border border-border p-5">
          {(
            [
              ["title", "Title"],
              ["slug", "URL slug"],
              ["cover_image", "Cover image URL"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label htmlFor={`p-${key}`}>{label}</Label>
              <Input
                id={`p-${key}`}
                className="mt-1.5"
                value={String(draft[key] ?? "")}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <Label htmlFor="p-excerpt">Excerpt</Label>
            <Textarea
              id="p-excerpt"
              rows={2}
              className="mt-1.5"
              value={String(draft["excerpt"] ?? "")}
              onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="p-body">Article body</Label>
            <Textarea
              id="p-body"
              rows={14}
              className="mt-1.5"
              value={String(draft["body"] ?? "")}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={() => save.mutate(draft)}>Save guide</Button>
            <Button variant="ghost" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {(data ?? []).map((p) => (
          <div key={String(p["id"])} className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-display font-bold">{String(p["title"])}</p>
              <p className="text-xs text-muted-foreground">/guides/{String(p["slug"])}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setDraft(p)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => confirm("Delete this guide?") && remove.mutate(String(p["id"]))}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
