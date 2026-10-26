import { company } from "@/data/company";
import { getBrands, getProducts } from "@/lib/catalog";
import { getContact } from "@/lib/contact";
import { absoluteUrl } from "@/lib/site";

// Options for the contact form's "Enquiry about" field, grouped by brand.
// Each carries its own recipient so maker-specific contacts route correctly.
// value: "general" | "brand:<slug>" | "product:<slug>"
export function getEnquiryTopics() {
  const products = getProducts();
  const general = {
    value: "general",
    label: "General enquiry",
    subject: "General enquiry",
    to: company.name,
    email: company.contact.email,
    whatsapp: company.contact.whatsapp,
  };

  const groups = getBrands().map((brand) => {
    const brandContact = getContact(null, brand);
    const items = [
      {
        value: `brand:${brand.slug}`,
        label: `Any ${brand.name} product`,
        subject: `${brand.name} products`,
        to: brandContact.isDirect ? brand.name : company.name,
        email: brandContact.email,
        whatsapp: brandContact.whatsapp,
        url: absoluteUrl(`/brands/${brand.slug}`),
      },
      ...products
        .filter((p) => p.brand.slug === brand.slug)
        .map((p) => {
          const contact = getContact(p, p.brand);
          return {
            value: `product:${p.slug}`,
            label: p.name,
            subject: `${brand.name} ${p.name}`,
            to: contact.isDirect ? brand.name : company.name,
            email: contact.email,
            whatsapp: contact.whatsapp,
            url: absoluteUrl(`/products/${p.slug}`),
          };
        }),
    ];
    return { label: brand.name, items };
  });

  return { general, groups };
}
