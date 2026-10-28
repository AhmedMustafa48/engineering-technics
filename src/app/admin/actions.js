"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import sharp from "sharp";
import { requireAdmin } from "@/lib/admin/auth";
import { CATALOG_TAG } from "@/lib/catalog-source";
import { createServiceClient } from "@/lib/supabase/admin";
import { createSessionClient } from "@/lib/supabase/server";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const text = (fd, k) => String(fd.get(k) ?? "").trim();
const json = (fd, k, fallback) => {
  try {
    return JSON.parse(String(fd.get(k) || "")) ?? fallback;
  } catch {
    return fallback;
  }
};

function refresh() {
  updateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
}

// Resize to web-friendly WebP, make a tiny blur placeholder, store in the public "catalog" bucket.
async function uploadImage(file, folder, name) {
  if (!file || typeof file === "string" || file.size === 0) return null;
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image`);
  const input = Buffer.from(await file.arrayBuffer());
  const { data, info } = await sharp(input).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true });
  const blur = await sharp(input).rotate().resize(12).webp({ quality: 40 }).toBuffer();
  const path = `${folder}/${name}-${randomUUID().slice(0, 8)}.webp`;
  const storage = createServiceClient().storage.from("catalog");
  const { error } = await storage.upload(path, data, { contentType: "image/webp", cacheControl: "31536000" });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return {
    src: storage.getPublicUrl(path).data.publicUrl,
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
  };
}

export async function login(_prev, formData) {
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email: text(formData, "email"), password: String(formData.get("password") ?? "") });
  if (error) return { error: "Wrong email or password." };
  redirect("/admin");
}

export async function logout() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// Saves a main product together with all of its items and each item's suppliers.
export async function saveProduct(_prev, formData) {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const slug = text(formData, "slug").toLowerCase();
  if (!name) return { error: "Product name is required." };
  if (!SLUG.test(slug)) return { error: "Slug must be lowercase letters, numbers and hyphens (e.g. power-transformer)." };

  const items = json(formData, "items", []);
  const seen = new Set();
  for (const [n, item] of items.entries()) {
    if (!item.name?.trim()) return { error: `Item ${n + 1} needs a name.` };
    if (!SLUG.test(item.slug ?? "")) return { error: `Item "${item.name}" has an invalid slug (lowercase letters, numbers, hyphens).` };
    if (seen.has(item.slug)) return { error: `Two items use the slug "${item.slug}". Slugs must be unique within a product.` };
    seen.add(item.slug);
  }

  try {
    const supabase = await createSessionClient();
    const image = (await uploadImage(formData.get("image_file"), "products", slug)) ?? json(formData, "existing_image", null);
    const row = {
      slug,
      name,
      icon: text(formData, "icon") || "Package",
      summary: text(formData, "summary"),
      description: text(formData, "description"),
      image,
      published: formData.get("published") === "on",
      seo_title: text(formData, "seo_title") || null,
      seo_description: text(formData, "seo_description") || null,
    };
    const saved = id
      ? await supabase.from("products").update(row).eq("id", id).select("id").single()
      : await supabase.from("products").insert(row).select("id").single();
    if (saved.error) return { error: saved.error.code === "23505" ? "That slug is already used by another product." : saved.error.message };
    const productId = saved.data.id;

    // Remove items that were deleted in the form.
    const keep = items.map((i) => i.id).filter(Boolean);
    const { data: existing } = await supabase.from("items").select("id").eq("product_id", productId);
    const gone = (existing ?? []).map((e) => e.id).filter((e) => !keep.includes(e));
    if (gone.length) await supabase.from("items").delete().in("id", gone);

    // Park kept items on temporary slugs so reordering/renaming slugs never collides.
    for (const item of items.filter((i) => i.id)) await supabase.from("items").update({ slug: `tmp-${item.id}` }).eq("id", item.id);

    for (const [n, item] of items.entries()) {
      const upload = await uploadImage(formData.get(`item_image_${n}`), "items", item.slug);
      const itemRow = {
        product_id: productId,
        slug: item.slug,
        name: item.name.trim(),
        description: (item.description ?? "").trim(),
        image: upload ?? item.image ?? null,
        sort_order: n,
      };
      const result = item.id
        ? await supabase.from("items").update(itemRow).eq("id", item.id).select("id").single()
        : await supabase.from("items").insert(itemRow).select("id").single();
      if (result.error) return { error: `Item "${item.name}": ${result.error.message}` };

      await supabase.from("item_suppliers").delete().eq("item_id", result.data.id);
      const links = [];
      for (const [sort_order, offer] of (item.suppliers ?? []).entries()) {
        const photo = await uploadImage(formData.get(`offer_image_${n}_${offer.slug}`), "items", `${item.slug}-${offer.slug}`);
        links.push({ item_id: result.data.id, brand_slug: offer.slug, image: photo ?? offer.image ?? null, sort_order });
      }
      if (links.length) {
        const linked = await supabase.from("item_suppliers").insert(links);
        if (linked.error) return { error: `Suppliers for "${item.name}": ${linked.error.message}` };
      }
    }
  } catch (e) {
    return { error: e.message };
  }
  refresh();
  redirect("/admin?saved=1");
}

export async function deleteProduct(formData) {
  await requireAdmin();
  const supabase = await createSessionClient();
  await supabase.from("products").delete().eq("id", text(formData, "id"));
  refresh();
  redirect("/admin?deleted=1");
}

export async function saveBrand(_prev, formData) {
  await requireAdmin();
  const original = text(formData, "original_slug");
  const slug = text(formData, "slug").toLowerCase();
  if (!text(formData, "name")) return { error: "Name is required." };
  if (!SLUG.test(slug)) return { error: "Slug must be lowercase letters, numbers and hyphens." };
  try {
    const logo = (await uploadImage(formData.get("logo_file"), "brands", slug)) ?? json(formData, "existing_logo", null);
    const row = {
      slug,
      name: text(formData, "name"),
      full_name: text(formData, "full_name") || null,
      country: text(formData, "country") || null,
      description: text(formData, "description"),
      logo,
    };
    const supabase = await createSessionClient();
    const { error } = original ? await supabase.from("brands").update(row).eq("slug", original) : await supabase.from("brands").insert(row);
    if (error) return { error: error.code === "23505" ? "That slug is already in use." : error.message };
  } catch (e) {
    return { error: e.message };
  }
  refresh();
  redirect("/admin/brands?saved=1");
}

export async function deleteBrand(formData) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { error } = await supabase.from("brands").delete().eq("slug", text(formData, "slug"));
  if (error) redirect("/admin/brands?error=in-use");
  refresh();
  redirect("/admin/brands?deleted=1");
}
