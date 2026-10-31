// Uploads the logos in public/images/new-brands to Supabase Storage and points each supplier's
// `logo` at them (logos come from src/data/brands.js).
// Usage: node --env-file=.env.local scripts/set-brand-logos.mjs
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");

const root = process.cwd();
const { brands } = await import(pathToFileURL(path.join(root, "src/data/brands.js")).href);

const db = createClient(url, key, { auth: { persistSession: false } });
const storage = db.storage.from("catalog");
const TYPES = { ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg" };

for (const b of brands) {
  if (!b.logo) continue;
  const file = path.basename(b.logo.src);
  const dest = `brands/${file}`;
  const body = await readFile(path.join(root, "public", b.logo.src));
  const { error: upErr } = await storage.upload(dest, body, {
    contentType: TYPES[path.extname(file)] ?? "application/octet-stream",
    upsert: true,
    cacheControl: "31536000",
  });
  if (upErr) throw new Error(`upload ${dest}: ${upErr.message}`);
  const logo = { src: storage.getPublicUrl(dest).data.publicUrl, width: b.logo.width, height: b.logo.height };
  const { data, error } = await db.from("brands").update({ logo }).eq("slug", b.slug).select("slug");
  if (error) throw new Error(`update ${b.slug}: ${error.message}`);
  console.log(data.length ? `✓ ${b.slug} → ${dest}` : `✗ ${b.slug} not found in brands table`);
}
