import "server-only";
import { unstable_cache } from "next/cache";
import { seed } from "@/data/seed";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

export const CATALOG_TAG = "catalog";

const mapBrand = (r) => ({
  slug: r.slug,
  name: r.name,
  fullName: r.full_name ?? r.name,
  logo: r.logo ?? null,
  country: r.country ?? undefined,
  description: r.description,
  contact: r.contact ?? undefined,
});

const bySort = (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name);

const mapProduct = (r) => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  icon: r.icon,
  summary: r.summary,
  description: r.description,
  image: r.image ?? null,
  seoTitle: r.seo_title ?? undefined,
  seoDescription: r.seo_description ?? undefined,
  updatedAt: r.updated_at,
  items: (r.items ?? []).sort(bySort).map((i) => ({
    id: i.id,
    slug: i.slug,
    name: i.name,
    description: i.description,
    image: i.image ?? null,
    updatedAt: i.updated_at,
    suppliers: (i.item_suppliers ?? []).sort((a, b) => a.sort_order - b.sort_order).map((s) => ({ slug: s.brand_slug, image: s.image ?? null })),
  })),
});

async function loadFromSupabase() {
  const db = createPublicClient();
  const [brands, products] = await Promise.all([
    db.from("brands").select("*").order("sort_order").order("name"),
    db.from("products").select("*, items(*, item_suppliers(brand_slug, sort_order, image))").order("sort_order").order("name"),
  ]);
  const error = brands.error ?? products.error;
  if (error) throw new Error(`Supabase catalogue query failed: ${error.message}`);
  return { brands: brands.data.map(mapBrand), products: products.data.map(mapProduct) };
}

// One cached read for the whole catalogue (it is small). Admin edits call updateTag("catalog").
export const getCatalogData = unstable_cache(
  async () => (isSupabaseConfigured ? loadFromSupabase() : seed),
  ["catalog-data-v2"],
  { tags: [CATALOG_TAG], revalidate: 3600 },
);
