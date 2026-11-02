"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import sharp from "sharp";
import { requireAdmin } from "@/lib/admin/auth";
import { iconForCategory } from "@/lib/admin/derive";
import { CATALOG_TAG } from "@/lib/catalog-source";
import { createServiceClient } from "@/lib/supabase/admin";
import { createSessionClient } from "@/lib/supabase/server";

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const BAD_SLUG = "Slug must be lowercase letters, numbers and hyphens (e.g. cooling-fan).";
const text =(fd, k) => String(fd.get(k) ?? "").trim();
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

// A category is a row in `products` (the main product shown in the site's left list).
export async function saveCategory(_prev, formData) {
  await requireAdmin();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const slug = text(formData, "slug").toLowerCase();
  if (!name) return { error: "Category name is required." };
  if (!SLUG.test(slug)) return { error: BAD_SLUG };

  try {
    const supabase = await createSessionClient();
    const image = (await uploadImage(formData.get("image_file"), "products", slug)) ?? json(formData, "existing_image", null);
    const row = {
      slug,
      name,
      icon: iconForCategory(name),
      summary: text(formData, "summary"),
      description: text(formData, "description"),
      image,
      published: formData.get("published") === "on",
      seo_title: text(formData, "seo_title") || null,
      seo_description: text(formData, "seo_description") || null,
    };
    const { error } = id ? await supabase.from("products").update(row).eq("id", id) : await supabase.from("products").insert(row);
    if (error) return { error: error.code === "23505" ? "That slug is already used by another category." : error.message };
  } catch (e) {
    return { error: e.message };
  }
  refresh();
  redirect("/admin/categories?saved=1");
}

// Items cascade with their category, so a category must be emptied before it can be deleted.
export async function deleteCategory(formData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createSessionClient();
  const { count } = await supabase.from("items").select("id", { count: "exact", head: true }).eq("product_id", id);
  if (count) redirect(`/admin/categories/${id}?error=has-items`);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) redirect(`/admin/categories/${id}?error=failed`);
  refresh();
  redirect("/admin/categories?deleted=1");
}

// Saves one item, its category and the suppliers that offer it.
export async function saveItem(_prev, formData) {
  await requireAdmin();
  const id = text(formData, "id");
  const productId = text(formData, "product_id");
  const name = text(formData, "name");
  const slug = text(formData, "slug").toLowerCase();
  if (!productId) return { error: "Select a category for this item." };
  if (!name) return { error: "Item name is required." };
  if (!SLUG.test(slug)) return { error: BAD_SLUG };

  try {
    const supabase = await createSessionClient();
    const image = (await uploadImage(formData.get("image_file"), "items", slug)) ?? json(formData, "existing_image", null);
    const links = json(formData, "suppliers", []).map((offer, sort_order) => ({ brand_slug: offer.slug, image: offer.image ?? null, sort_order }));

    const row = { product_id: productId, slug, name, description: text(formData, "description"), image };
    const { data: current } = id ? await supabase.from("items").select("product_id").eq("id", id).maybeSingle() : { data: null };
    // New items, and items moved to another category, join the end of that category.
    if (current?.product_id !== productId) {
      const { data: last } = await supabase.from("items").select("sort_order").eq("product_id", productId).order("sort_order", { ascending: false }).limit(1).maybeSingle();
      row.sort_order = (last?.sort_order ?? -1) + 1;
    }
    const saved = id
      ? await supabase.from("items").update(row).eq("id", id).select("id").single()
      : await supabase.from("items").insert(row).select("id").single();
    if (saved.error) {
      return { error: saved.error.code === "23505" ? "Another item in this category already uses this slug. Change the slug, for example by adding the supplier name." : saved.error.message };
    }

    await supabase.from("item_suppliers").delete().eq("item_id", saved.data.id);
    if (links.length) {
      const linked = await supabase.from("item_suppliers").insert(links.map((l) => ({ ...l, item_id: saved.data.id })));
      if (linked.error) return { error: `Suppliers: ${linked.error.message}` };
    }
  } catch (e) {
    return { error: e.message };
  }
  refresh();
  redirect(`/admin/items?category=${productId}&saved=1`);
}

export async function deleteItem(formData) {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { error } = await supabase.from("items").delete().eq("id", text(formData, "id"));
  if (error) redirect(`/admin/items/${text(formData, "id")}?error=failed`);
  refresh();
  redirect(`/admin/items?category=${text(formData, "category")}&deleted=1`);
}

// Moves an item one place up or down within its category (the order shown on the site).
export async function moveItem(formData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createSessionClient();
  const { data: item } = await supabase.from("items").select("product_id").eq("id", id).maybeSingle();
  if (!item) return;
  const { data: list } = await supabase.from("items").select("id, sort_order").eq("product_id", item.product_id).order("sort_order").order("name");
  const from = list.findIndex((i) => i.id === id);
  const to = from + (text(formData, "direction") === "up" ? -1 : 1);
  if (to < 0 || to >= list.length) return;
  [list[from], list[to]] = [list[to], list[from]];
  for (const [n, row] of list.entries()) {
    if (row.sort_order !== n) await supabase.from("items").update({ sort_order: n }).eq("id", row.id);
  }
  refresh();
}

export async function saveBrand(_prev, formData) {
  await requireAdmin();
  const original = text(formData, "original_slug");
  const name = text(formData, "name");
  const slug = text(formData, "slug").toLowerCase();
  if (!name) return { error: "Name is required." };
  if (!SLUG.test(slug)) return { error: BAD_SLUG };
  try {
    const logo = (await uploadImage(formData.get("logo_file"), "brands", slug)) ?? json(formData, "existing_logo", null);
    const row = {
      slug,
      name,
      full_name: text(formData, "full_name") || null,
      country: text(formData, "country") || null,
      description: text(formData, "description"),
      logo,
    };
    const supabase = await createSessionClient();
    const { error } = original ? await supabase.from("brands").update(row).eq("slug", original) : await supabase.from("brands").insert(row);
    if (error) return { error: error.code === "23505" ? "That slug is already used by another supplier." : error.message };
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
