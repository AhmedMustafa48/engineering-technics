// One-off: keep only the suppliers listed in src/data/brands.js in Supabase.
// Removes every other supplier, the items that only they supplied, and products left empty.
// Usage: node --env-file=.env.local scripts/prune-suppliers.mjs [--apply]   (dry run without --apply)
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
const { brands } = await import(pathToFileURL(path.join(process.cwd(), "src/data/brands.js")).href);
const keep = new Set(brands.map((b) => b.slug));
const db = createClient(url, key, { auth: { persistSession: false } });
const must = (label, { data, error }) => {
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
};

const all = must("brands", await db.from("brands").select("slug, name"));
const remove = all.filter((b) => !keep.has(b.slug));
const removeSlugs = remove.map((b) => b.slug);
console.log("Suppliers to remove:", removeSlugs.join(", ") || "none");

const links = must("links", await db.from("item_suppliers").select("item_id, brand_slug"));
const touched = new Set(links.filter((l) => removeSlugs.includes(l.brand_slug)).map((l) => l.item_id));
const stays = new Set(links.filter((l) => keep.has(l.brand_slug)).map((l) => l.item_id));
const orphanItems = [...touched].filter((id) => !stays.has(id));
console.log(`Items only supplied by removed suppliers: ${orphanItems.length}`);

if (!apply) {
  console.log("Dry run. Re-run with --apply to delete.");
  process.exit(0);
}

if (removeSlugs.length) must("unlink", await db.from("item_suppliers").delete().in("brand_slug", removeSlugs));
if (orphanItems.length) must("items", await db.from("items").delete().in("id", orphanItems));
const products = must("products", await db.from("products").select("id, slug, items(id)"));
const empty = products.filter((p) => p.items.length === 0).map((p) => p.slug);
if (empty.length) must("empty products", await db.from("products").delete().in("slug", empty));
if (removeSlugs.length) must("brands", await db.from("brands").delete().in("slug", removeSlugs));

// Add the listed suppliers that are not in the database yet (existing ones are left untouched).
const present = new Set(must("brands", await db.from("brands").select("slug")).map((b) => b.slug));
const fresh = brands
  .map((b, i) => ({ b, i }))
  .filter(({ b }) => !present.has(b.slug))
  .map(({ b, i }) => ({ slug: b.slug, name: b.name, full_name: b.fullName ?? null, description: b.description ?? "", sort_order: i }));
if (fresh.length) must("add suppliers", await db.from("brands").insert(fresh));
console.log(`Done. Removed ${removeSlugs.length} suppliers, ${orphanItems.length} items, ${empty.length} empty products (${empty.join(", ") || "-"}); added ${fresh.length} suppliers.`);
