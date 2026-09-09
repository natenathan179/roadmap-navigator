import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

export type Rv = {
  id: string;
  slug: string;
  stock_number: string;
  year: number;
  make: string;
  brand: string | null;
  model: string;
  rv_class: string;
  rv_type: string | null;
  condition: string;
  fuel_type: string;
  engine: string | null;
  price: number;
  msrp: number | null;
  mileage: number;
  length_ft: number | null;
  sleeps: number | null;
  slides: number | null;
  dry_weight: number | null;
  gvwr: number | null;
  fresh_water: number | null;
  ext_color: string | null;
  int_color: string | null;
  vin: string | null;
  location: string;
  description: string | null;
  highlights: string[];
  features: string[];
  specs: Record<string, string>;
  photos: string[];
  photo_alts: string[];
  seo_title: string | null;
  seo_description: string | null;
  video_url: string | null;
  featured: boolean;
  status: string;
  published: boolean;
  created_at: string;
};

export type Review = {
  id: string;
  customer_name: string;
  rating: number;
  title: string | null;
  body: string;
  location: string | null;
  avatar_url: string | null;
  reviewed_on: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  published_at: string;
};

const RV_COLUMNS = "*";

function normalize(row: Record<string, unknown>): Rv {
  const length = row["length_ft"];
  return {
    ...(row as unknown as Rv),
    price: Number(row["price"] ?? 0),
    length_ft: length === null || length === undefined ? null : Number(length),
  };
}

export async function fetchRvs(): Promise<Rv[]> {
  const { data, error } = await supabase
    .from("rvs")
    .select(RV_COLUMNS)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => normalize(row as Record<string, unknown>));
}

export async function fetchRvByStock(stock: string): Promise<Rv | null> {
  const { data, error } = await supabase
    .from("rvs")
    .select(RV_COLUMNS)
    .eq("stock_number", stock)
    .maybeSingle();
  if (error) throw error;
  return data ? normalize(data as Record<string, unknown>) : null;
}

export async function fetchReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id,customer_name,rating,body,reviewed_on")
    .order("reviewed_on", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Review[];
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,slug,title,excerpt,body,cover_image,published_at")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,slug,title,excerpt,body,cover_image,published_at")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as BlogPost) ?? null;
}

export const rvsQuery = () => queryOptions({ queryKey: ["rvs"], queryFn: fetchRvs, staleTime: 60_000 });
export const rvQuery = (stock: string) =>
  queryOptions({ queryKey: ["rv", stock], queryFn: () => fetchRvByStock(stock), staleTime: 60_000 });
export const reviewsQuery = () =>
  queryOptions({ queryKey: ["reviews"], queryFn: fetchReviews, staleTime: 300_000 });
export const postsQuery = () =>
  queryOptions({ queryKey: ["posts"], queryFn: fetchPosts, staleTime: 300_000 });
export const postQuery = (slug: string) =>
  queryOptions({ queryKey: ["post", slug], queryFn: () => fetchPostBySlug(slug), staleTime: 300_000 });

export const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export const miles = (value: number) => new Intl.NumberFormat("en-US").format(value);

export const rvTitle = (rv: Pick<Rv, "year" | "make" | "model">) => `${rv.year} ${rv.make} ${rv.model}`;

export type SortKey = "newest" | "price-asc" | "price-desc" | "mileage" | "featured";

export type Filters = {
  q: string;
  condition: string;
  rvClass: string;
  fuel: string;
  make: string;
  yearMin: number;
  priceMax: number;
  mileageMax: number;
  lengthMax: number;
  sleeps: number;
  slides: number;
  location: string;
  sort: SortKey;
};

export function applyFilters(list: Rv[], f: Filters): Rv[] {
  const q = f.q.trim().toLowerCase();
  const filtered = list.filter((rv) => {
    if (q && !`${rv.year} ${rv.make} ${rv.model} ${rv.rv_class} ${rv.stock_number}`.toLowerCase().includes(q))
      return false;
    if (f.condition && rv.condition !== f.condition) return false;
    if (f.rvClass && rv.rv_class !== f.rvClass) return false;
    if (f.fuel && rv.fuel_type !== f.fuel) return false;
    if (f.make && rv.make !== f.make) return false;
    if (f.yearMin && rv.year < f.yearMin) return false;
    if (f.priceMax && rv.price > f.priceMax) return false;
    if (f.mileageMax && rv.mileage > f.mileageMax) return false;
    if (f.lengthMax && (rv.length_ft ?? 0) > f.lengthMax) return false;
    if (f.sleeps && (rv.sleeps ?? 0) < f.sleeps) return false;
    if (f.slides && (rv.slides ?? 0) < f.slides) return false;
    if (f.location && rv.location !== f.location) return false;
    return true;
  });

  const sorted = [...filtered];
  switch (f.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "mileage":
      sorted.sort((a, b) => a.mileage - b.mileage);
      break;
    case "newest":
      sorted.sort((a, b) => b.year - a.year);
      break;
    default:
      sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year);
  }
  return sorted;
}
