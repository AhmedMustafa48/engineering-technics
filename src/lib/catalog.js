import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import imageManifest from "@/data/images.json";
import { normalizeSearch } from "@/lib/search";

const brandMap = new Map(brands.map((b) => [b.slug, b]));
const categoryMap = new Map(categories.map((c) => [c.slug, c]));

function resolveImage(key, alt) {
  const img = imageManifest[key];
  return img ? { ...img, key, alt } : null;
}

function hydrate(p) {
  const brand = brandMap.get(p.brand);
  const category = categoryMap.get(p.category);
  return {
    highlights: [],
    specs: [],
    tables: [],
    models: [],
    standards: [],
    ...p,
    brand,
    category,
    images: p.images.map((key, i) =>
      resolveImage(key, `${brand.name} ${p.name}${i ? ` — view ${i + 1}` : ""}`),
    ),
  };
}

// Fail the build on broken references rather than rendering a broken page.
function validate() {
  const errors = [];
  const seen = new Set();
  for (const p of products) {
    if (seen.has(p.slug)) errors.push(`duplicate slug "${p.slug}"`);
    seen.add(p.slug);
    if (!brandMap.has(p.brand)) errors.push(`${p.slug}: unknown brand "${p.brand}"`);
    if (!categoryMap.has(p.category)) errors.push(`${p.slug}: unknown category "${p.category}"`);
    for (const key of p.images) if (!imageManifest[key]) errors.push(`${p.slug}: missing image "${key}"`);
  }
  for (const b of brands) if (b.logo && !imageManifest[b.logo]) errors.push(`brand ${b.slug}: missing logo "${b.logo}"`);
  if (errors.length) throw new Error(`Catalogue data errors:\n  ${errors.join("\n  ")}`);
}
validate();

const allProducts = products.map(hydrate);
const productMap = new Map(allProducts.map((p) => [p.slug, p]));

export function getProducts() {
  return allProducts;
}

export function getProduct(slug) {
  return productMap.get(slug) ?? null;
}

export function getFeaturedProducts() {
  return allProducts.filter((p) => p.featured);
}

export function getProductsByCategory(slug) {
  return allProducts.filter((p) => p.category.slug === slug);
}

export function getProductsByBrand(slug) {
  return allProducts.filter((p) => p.brand.slug === slug);
}

// Same category first, then same brand; never the product itself.
export function getRelatedProducts(product, limit = 4) {
  const others = allProducts.filter((p) => p.slug !== product.slug);
  const sameCategory = others.filter((p) => p.category.slug === product.category.slug);
  const sameBrand = others.filter((p) => p.brand.slug === product.brand.slug && !sameCategory.includes(p));
  return [...sameCategory, ...sameBrand].slice(0, limit);
}

export function getBrands() {
  return brands.map((b) => ({
    ...b,
    logoImage: b.logo ? resolveImage(b.logo, `${b.name} logo`) : null,
    productCount: allProducts.filter((p) => p.brand.slug === b.slug).length,
  }));
}

export function getBrand(slug) {
  return getBrands().find((b) => b.slug === slug) ?? null;
}

export function getCategories() {
  return categories.map((c) => {
    const inCategory = allProducts.filter((p) => p.category.slug === c.slug);
    return {
      ...c,
      productCount: inCategory.length,
      coverImage: inCategory.find((p) => p.images.length)?.images[0] ?? null,
    };
  });
}

export function getCategory(slug) {
  return getCategories().find((c) => c.slug === slug) ?? null;
}

export function getSiteImage(key, alt) {
  return resolveImage(key, alt);
}

// Compact index for the global ⌘K search in the header.
export function getSearchData() {
  return {
    products: allProducts.map((p) => ({
      slug: p.slug,
      name: p.name,
      brand: p.brand.name,
      category: p.category.name,
      icon: p.category.icon,
      keywords: [p.brand.name, p.category.name, ...p.models],
    })),
    categories: categories.map(({ slug, name, icon }) => ({ slug, name, icon })),
    brands: brands.map(({ slug, name, fullName }) => ({ slug, name, fullName })),
  };
}

// Slim, serializable shape for the client-side product explorer.
// `haystack` lets visitors find a product by model number or spec value too.
export function getProductIndex() {
  return allProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    summary: p.summary,
    images: p.images.slice(0, 1),
    brand: { slug: p.brand.slug, name: p.brand.name },
    category: { slug: p.category.slug, name: p.category.name, icon: p.category.icon },
    haystack: normalizeSearch(
      [
        p.name,
        p.summary,
        p.description,
        p.brand.name,
        p.brand.fullName,
        p.category.name,
        ...p.models,
        ...p.standards,
        ...p.highlights,
        ...p.specs.map((s) => s.value),
        ...p.tables.flatMap((t) => t.rows.flat()),
      ].join(" "),
    ),
  }));
}
