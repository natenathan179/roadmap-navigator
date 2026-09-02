import { useQuery } from "@tanstack/react-query";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { RvCard } from "@/components/site/RvCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { RV_CLASSES, FUEL_TYPES } from "@/lib/dealership";
import { applyFilters, rvsQuery, type Rv } from "@/lib/inventory";
import { EMPTY_FILTERS, type InventorySearch } from "@/lib/search";

type Props = {
  search: InventorySearch;
  onChange: (next: Partial<InventorySearch>) => void;
  lockedCondition?: "new" | "used";
};

const SORT_OPTIONS: { value: InventorySearch["sort"]; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "mileage", label: "Lowest Mileage" },
];

function selectClass() {
  return "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring";
}

export function InventoryBrowser({ search, onChange, lockedCondition }: Props) {
  const f = { ...EMPTY_FILTERS, ...search };
  const { data, isLoading } = useQuery(rvsQuery());
  const [showFilters, setShowFilters] = useState(false);

  const list = useMemo<Rv[]>(() => {
    const base = data ?? [];
    const scoped = lockedCondition ? base.filter((rv) => rv.condition === lockedCondition) : base;
    return applyFilters(scoped, { ...f, condition: lockedCondition ? "" : f.condition });
  }, [data, f, lockedCondition]);

  const makes = useMemo(
    () => Array.from(new Set((data ?? []).map((rv) => rv.make))).sort(),
    [data],
  );
  const locations = useMemo(
    () => Array.from(new Set((data ?? []).map((rv) => rv.location))).sort(),
    [data],
  );

  const activeCount = (Object.keys(EMPTY_FILTERS) as (keyof InventorySearch)[]).filter(
    (key) => key !== "sort" && f[key] !== EMPTY_FILTERS[key],
  ).length;

  const filterPanel = (
    <div className="space-y-5">
      <div>
        <Label htmlFor="q">Keyword</Label>
        <Input
          id="q"
          value={f.q}
          placeholder="Make, model or stock #"
          onChange={(e) => onChange({ q: e.target.value })}
          className="mt-1.5"
        />
      </div>

      {lockedCondition ? null : (
        <div>
          <Label htmlFor="condition">Condition</Label>
          <select
            id="condition"
            className={`mt-1.5 ${selectClass()}`}
            value={f.condition}
            onChange={(e) => onChange({ condition: e.target.value })}
          >
            <option value="">New &amp; Used</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>
      )}

      <div>
        <Label htmlFor="rvClass">RV Class</Label>
        <select
          id="rvClass"
          className={`mt-1.5 ${selectClass()}`}
          value={f.rvClass}
          onChange={(e) => onChange({ rvClass: e.target.value })}
        >
          <option value="">All classes</option>
          {RV_CLASSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="fuel">Fuel</Label>
          <select
            id="fuel"
            className={`mt-1.5 ${selectClass()}`}
            value={f.fuel}
            onChange={(e) => onChange({ fuel: e.target.value })}
          >
            <option value="">Any</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="make">Manufacturer</Label>
          <select
            id="make"
            className={`mt-1.5 ${selectClass()}`}
            value={f.make}
            onChange={(e) => onChange({ make: e.target.value })}
          >
            <option value="">Any</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="yearMin">Year from</Label>
          <Input
            id="yearMin"
            inputMode="numeric"
            value={f.yearMin || ""}
            placeholder="2018"
            onChange={(e) => onChange({ yearMin: Number(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="priceMax">Max price</Label>
          <Input
            id="priceMax"
            inputMode="numeric"
            value={f.priceMax || ""}
            placeholder="300000"
            onChange={(e) => onChange({ priceMax: Number(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="mileageMax">Max mileage</Label>
          <Input
            id="mileageMax"
            inputMode="numeric"
            value={f.mileageMax || ""}
            placeholder="40000"
            onChange={(e) => onChange({ mileageMax: Number(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="lengthMax">Max length (ft)</Label>
          <Input
            id="lengthMax"
            inputMode="numeric"
            value={f.lengthMax || ""}
            placeholder="38"
            onChange={(e) => onChange({ lengthMax: Number(e.target.value) || 0 })}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="sleeps">Sleeps at least</Label>
          <select
            id="sleeps"
            className={`mt-1.5 ${selectClass()}`}
            value={f.sleeps || ""}
            onChange={(e) => onChange({ sleeps: Number(e.target.value) || 0 })}
          >
            <option value="">Any</option>
            {[2, 4, 6, 8].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="slides">Slides</Label>
          <select
            id="slides"
            className={`mt-1.5 ${selectClass()}`}
            value={f.slides || ""}
            onChange={(e) => onChange({ slides: Number(e.target.value) || 0 })}
          >
            <option value="">Any</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <select
          id="location"
          className={`mt-1.5 ${selectClass()}`}
          value={f.location}
          onChange={(e) => onChange({ location: e.target.value })}
        >
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => onChange({ ...EMPTY_FILTERS, sort: f.sort })}
      >
        Reset filters
      </Button>
    </div>
  );

  return (
    <div className="container-page grid gap-8 py-12 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-lg border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-primary">
            Refine Your Search
          </h2>
          <div className="mt-5">{filterPanel}</div>
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-display text-lg font-bold text-foreground">{list.length}</span>{" "}
            {list.length === 1 ? "motorhome" : "motorhomes"} available
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(true)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters{activeCount ? ` (${activeCount})` : ""}
            </Button>
            <label htmlFor="sort" className="sr-only">
              Sort by
            </label>
            <select
              id="sort"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              value={f.sort}
              onChange={(e) => onChange({ sort: e.target.value as InventorySearch["sort"] })}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  Sort: {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-96 w-full rounded-lg" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="mt-16 rounded-lg border border-dashed border-border p-12 text-center">
            <h3 className="font-display text-lg font-bold">No motorhomes match those filters</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try widening your price or mileage range — new units arrive weekly.
            </p>
            <Button className="mt-5" onClick={() => onChange({ ...EMPTY_FILTERS, sort: f.sort })}>
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((rv) => (
              <RvCard key={rv.id} rv={rv} />
            ))}
          </div>
        )}
      </div>

      {showFilters ? (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="relative ml-auto h-full w-[86%] max-w-sm overflow-y-auto bg-background p-5 pb-24">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-base font-bold">Filters</h2>
              <button type="button" aria-label="Close filters" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterPanel}
            <Button className="mt-5 w-full" onClick={() => setShowFilters(false)}>
              Show {list.length} results
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
