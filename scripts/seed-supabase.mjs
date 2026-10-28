// Copies the starter catalogue (src/data/seed.js) and its images into Supabase.
// Usage: npm run db:seed        (reads .env.local; safe to re-run, it upserts)
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
if (/YOUR-PROJECT/i.test(url)) throw new Error("NEXT_PUBLIC_SUPABASE_URL in .env.local is still the placeholder. Use your real project URL.");

const root = process.cwd();
const { seed } = await import(pathToFileURL(path.join(root, "src/data/seed.js")).href);
const manifest = JSON.parse(await readFile(path.join(root, "src/data/images.json"), "utf8"));

const db = createClient(url, key, { auth: { persistSession: false } });
const storage = db.storage.from("catalog");
const uploaded = new Map();

// images.json key -> { src (public Storage URL), width, height, blurDataURL }
async function image(keyName) {
  if (!keyName) return null;
  if (uploaded.has(keyName)) return uploaded.get(keyName);
  const m = manifest[keyName];
  if (!m) throw new Error(`Missing image "${keyName}" in images.json`);
  const file = await readFile(path.join(root, "public", m.src));
  const dest = m.src.replace(/^\/images\//, "seed/");
  const { error } = await storage.upload(dest, file, { contentType: "image/webp", upsert: true, cacheControl: "31536000" });
  if (error) throw new Error(`upload ${dest}: ${error.message}`);
  const out = { src: storage.getPublicUrl(dest).data.publicUrl, width: m.width, height: m.height, blurDataURL: m.blurDataURL };
  uploaded.set(keyName, out);
  return out;
}

function check(label, { error }) {
  if (error) throw new Error(`${label}: ${error.message}`);
  console.log(`✓ ${label}`);
}

// Suppliers (the `brands` table)
check(
  `suppliers (${seed.brands.length})`,
  await db.from("brands").upsert(
    await Promise.all(
      seed.brands.map(async (b, i) => ({
        slug: b.slug,
        name: b.name,
        full_name: b.fullName ?? null,
        country: b.country ?? null,
        description: b.description ?? "",
        logo: await image(b.logo),
        contact: b.contact ?? null,
        sort_order: i,
      })),
    ),
  ),
);

// Products → items → item_suppliers
let itemTotal = 0;
for (const [pi, p] of seed.products.entries()) {
  const { data: product, error } = await db
    .from("products")
    .upsert(
      {
        slug: p.slug,
        name: p.name,
        icon: p.icon,
        summary: p.summary,
        description: p.description,
        image: await image(p.image),
        published: true,
        sort_order: pi,
      },
      { onConflict: "slug" },
    )
    .select("id")
    .single();
  if (error) throw new Error(`product ${p.slug}: ${error.message}`);

  const rows = [];
  for (const [ii, item] of p.items.entries()) {
    rows.push({ product_id: product.id, slug: item.slug, name: item.name, description: item.description, image: await image(item.image), sort_order: ii });
  }
  const { data: items, error: itemError } = await db.from("items").upsert(rows, { onConflict: "product_id,slug" }).select("id, slug");
  if (itemError) throw new Error(`items of ${p.slug}: ${itemError.message}`);

  const idBySlug = new Map(items.map((i) => [i.slug, i.id]));
  const links = [];
  for (const item of p.items) {
    for (const [si, s] of item.suppliers.entries()) {
      links.push({ item_id: idBySlug.get(item.slug), brand_slug: s.slug, image: await image(s.image), sort_order: si });
    }
  }
  check(`links of ${p.slug}`, await db.from("item_suppliers").upsert(links, { onConflict: "item_id,brand_slug" }));
  itemTotal += items.length;
  console.log(`✓ ${p.name}: ${items.length} items`);
}
console.log(`Done. ${seed.products.length} products, ${itemTotal} items.`);
