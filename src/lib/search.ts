import type { Filters, SortKey } from "./inventory";

const SORTS: SortKey[] = ["newest", "price-asc", "price-desc", "mileage", "featured"];

const str = (v: unknown) => (typeof v === "string" ? v : "");
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : 0;
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export type InventorySearch = Filters;

export function parseInventorySearch(search: Record<string, unknown>): InventorySearch {
  const sort = str(search["sort"]) as SortKey;
  return {
    q: str(search["q"]),
    condition: str(search["condition"]),
    rvClass: str(search["rvClass"]),
    fuel: str(search["fuel"]),
    make: str(search["make"]),
    location: str(search["location"]),
    yearMin: num(search["yearMin"]),
    priceMax: num(search["priceMax"]),
    mileageMax: num(search["mileageMax"]),
    lengthMax: num(search["lengthMax"]),
    sleeps: num(search["sleeps"]),
    slides: num(search["slides"]),
    sort: SORTS.includes(sort) ? sort : "featured",
  };
}

export const EMPTY_FILTERS: InventorySearch = {
  q: "",
  condition: "",
  rvClass: "",
  fuel: "",
  make: "",
  location: "",
  yearMin: 0,
  priceMax: 0,
  mileageMax: 0,
  lengthMax: 0,
  sleeps: 0,
  slides: 0,
  sort: "featured",
};
