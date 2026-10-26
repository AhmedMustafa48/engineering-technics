import catalogue from "@/data/catalogue.json";
import { getProducts } from "@/lib/catalog";

export function getCatalogue() {
  const products = getProducts();
  const last = catalogue.pages.length;

  const pages = catalogue.pages.map((page) => {
    const onPage = products.filter((p) => p.cataloguePage === page.number);
    const brands = [...new Set(onPage.map((p) => p.brand.name))];
    const brandSlugs = [...new Set(onPage.map((p) => p.brand.slug))];
    const label = page.number === 1 ? "Cover" : page.number === last ? "Contact" : brands.join(" · ") || `Page ${page.number}`;
    return {
      ...page,
      label,
      brandSlug: brandSlugs.length === 1 ? brandSlugs[0] : null,
      products: onPage.map((p) => ({ slug: p.slug, name: p.name, brand: p.brand.name })),
    };
  });

  return { pdf: catalogue.pdf, pdfBytes: catalogue.pdfBytes, pages };
}

export function formatBytes(bytes) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}
