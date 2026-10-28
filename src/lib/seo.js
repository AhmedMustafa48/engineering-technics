import { company } from "@/data/company";
import { absoluteUrl } from "@/lib/site";

const abs = (src) => (src?.startsWith("http") ? src : src ? absoluteUrl(src) : undefined);

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: company.name,
    url: absoluteUrl("/"),
    description: company.description,
    email: company.contact.email,
    telephone: company.contact.phoneIntl,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.officeAddress.street,
      addressLocality: "Lahore",
      postalCode: company.officeAddress.postalCode,
      addressCountry: company.officeAddress.countryCode,
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: company.name,
    url: absoluteUrl("/"),
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: absoluteUrl("/products?q={search_term_string}"),
      "query-input": "required name=search_term_string",
    },
  };
}

// crumbs: [{ name, path }] including the current page.
export function breadcrumbLd(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

// A main product with its items as a list of schema.org Products, each naming its suppliers.
export function productLd(product) {
  const url = absoluteUrl(`/products/${product.slug}`);
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${url}#page`,
      name: product.name,
      description: product.description || product.summary,
      url,
      image: product.image ? abs(product.image.src) : undefined,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: product.items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Product",
            name: item.name,
            description: item.description,
            url: `${url}#item-${item.slug}`,
            image: item.image ? abs(item.image.src) : undefined,
            category: product.name,
            brand: item.suppliers.map((s) => ({ "@type": "Brand", name: s.name })),
          },
        })),
      },
    },
  ];
}

// Common Open Graph / Twitter block for a page.
export function socialMeta({ title, description, path, image }) {
  const images = image ? [{ url: abs(image.src), width: image.width, height: image.height, alt: image.alt }] : undefined;
  return {
    openGraph: { title, description, url: absoluteUrl(path), type: "website", images },
    twitter: { card: "summary_large_image", title, description, images: images?.map((i) => i.url) },
  };
}
