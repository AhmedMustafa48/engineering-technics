import "server-only";
import { cache } from "react";
import imageManifest from "@/data/images.json";
import { brands as seedBrands } from "@/data/brands";
import { getCatalogData } from "@/lib/catalog-source";

// Official sites live in the seed list, so they apply whether the catalogue comes from Supabase or the seed.
const websites = new Map(seedBrands.map((b) => [b.slug, b.website]));

// An image is either a key into images.json (static seed) or an object
// ({ src, width, height, blurDataURL? }) as stored in Supabase.
function resolveImage(ref, alt) {
  if (!ref) return null;
  const img = typeof ref === "string" ? imageManifest[ref] : ref;
  return img ? { ...img, alt: img.alt || alt } : null;
}

// Derive every lookup once per request from the cached catalogue.
//   product (main) → items → suppliers (brands)
const build = cache(async () => {
  const data = await getCatalogData();
  const brandMap = new Map(
    data.brands.map((b) => [
      b.slug,
      { ...b, website: b.website ?? websites.get(b.slug) ?? null, logoImage: resolveImage(b.logo, `${b.name} logo`) },
    ]),
  );

  const products = data.products.map((p) => {
    const items = p.items.map((i) => {
      // Each supplier carries its own photo of the item (their branding / logo printing).
      const suppliers = i.suppliers
        .filter((s) => brandMap.has(s.slug))
        .map((s) => ({ ...brandMap.get(s.slug), offerImage: resolveImage(s.image, `${i.name} — ${brandMap.get(s.slug).name}`) }));
      return {
        ...i,
        productSlug: p.slug,
        productName: p.name,
        suppliers,
        // Fallback shown when a supplier has no photo of its own.
        image: resolveImage(i.image, i.name) ?? suppliers.find((s) => s.offerImage)?.offerImage ?? null,
      };
    });
    const supplierSlugs = new Set(items.flatMap((i) => i.suppliers.map((s) => s.slug)));
    return {
      ...p,
      image: resolveImage(p.image, p.name) ?? items.find((i) => i.image)?.image ?? null,
      items,
      itemCount: items.length,
      supplierCount: supplierSlugs.size,
    };
  });

  const itemCounts = new Map();
  for (const p of products) for (const i of p.items) for (const s of i.suppliers) itemCounts.set(s.slug, (itemCounts.get(s.slug) ?? 0) + 1);
  const brands = [...brandMap.values()].map((b) => ({ ...b, itemCount: itemCounts.get(b.slug) ?? 0 }));

  return { products, brands, productMap: new Map(products.map((p) => [p.slug, p])) };
});

export async function getProducts() {
  return (await build()).products;
}

export async function getProduct(slug) {
  return (await build()).productMap.get(slug) ?? null;
}

export async function getItemCount() {
  return (await build()).products.reduce((n, p) => n + p.itemCount, 0);
}

export async function getBrands() {
  return (await build()).brands;
}

export async function getBrand(slug) {
  return (await build()).brands.find((b) => b.slug === slug) ?? null;
}

// Every item a supplier offers, with the main product it belongs to.
export async function getItemsByBrand(slug) {
  const { products } = await build();
  // The returned image is this supplier's own photo of the item.
  return products.flatMap((p) =>
    p.items
      .filter((i) => i.suppliers.some((s) => s.slug === slug))
      .map((i) => ({ ...i, image: i.suppliers.find((s) => s.slug === slug)?.offerImage ?? i.image })),
  );
}

// Compact index for the global ⌘K search in the header.
export async function getSearchData() {
  const { products, brands } = await build();
  return {
    products: products.map(({ slug, name, icon }) => ({ slug, name, icon })),
    items: products.flatMap((p) =>
      p.items.map((i) => ({
        key: `${p.slug}/${i.slug}`,
        productSlug: p.slug,
        itemSlug: i.slug,
        name: i.name,
        product: p.name,
        suppliers: i.suppliers.map((s) => s.name),
      })),
    ),
    brands: brands.map(({ slug, name, fullName }) => ({ slug, name, fullName })),
  };
}
