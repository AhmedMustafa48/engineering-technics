import { getBrands, getProducts } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  const staticPages = ["/", "/about", "/products", "/brands", "/catalogue", "/contact"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
  return [
    ...staticPages,
    ...products.map((p) => ({
      url: absoluteUrl(`/products/${p.slug}`),
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      changeFrequency: "weekly",
      priority: 0.9,
    })),
    ...brands.map((b) => ({ url: absoluteUrl(`/brands/${b.slug}`), changeFrequency: "monthly", priority: 0.6 })),
  ];
}
