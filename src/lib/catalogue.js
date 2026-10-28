import catalogue from "@/data/catalogue.json";

// The printed catalogue is a fixed set of page images; it is not tied to the live product list.
export function getCatalogue() {
  const last = catalogue.pages.length;
  const pages = catalogue.pages.map((page) => ({
    ...page,
    label: page.number === 1 ? "Cover" : page.number === last ? "Contact" : `Page ${page.number}`,
    brandSlug: null,
    products: [],
  }));
  return { pdf: catalogue.pdf, pdfBytes: catalogue.pdfBytes, pages };
}

export function formatBytes(bytes) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}
