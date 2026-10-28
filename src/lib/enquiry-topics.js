import { company } from "@/data/company";
import { getBrands, getProducts } from "@/lib/catalog";
import { getContact } from "@/lib/contact";
import { absoluteUrl } from "@/lib/site";

// Options for the contact form's "Enquire about" field.
//   value: "general" | "supplier:<slug>" | "item:<product>/<item>"
// Items go to the distributor; suppliers with their own contact route there.
export async function getEnquiryTopics() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  const general = {
    value: "general",
    label: "General enquiry",
    subject: "General enquiry",
    to: company.name,
    email: company.contact.email,
    whatsapp: company.contact.whatsapp,
  };

  const groups = [
    ...products
      .filter((p) => p.items.length)
      .map((p) => ({
        label: p.name,
        items: p.items.map((i) => ({
          value: `item:${p.slug}/${i.slug}`,
          label: i.name,
          subject: `${p.name} — ${i.name}`,
          to: company.name,
          email: company.contact.email,
          whatsapp: company.contact.whatsapp,
          url: absoluteUrl(`/products/${p.slug}#item-${i.slug}`),
        })),
      })),
    {
      label: "Suppliers",
      items: brands.map((brand) => {
        const contact = getContact(null, brand);
        return {
          value: `supplier:${brand.slug}`,
          label: `Any ${brand.name} item`,
          subject: `${brand.name} items`,
          to: contact.isDirect ? brand.name : company.name,
          email: contact.email,
          whatsapp: contact.whatsapp,
          url: absoluteUrl(`/brands/${brand.slug}`),
        };
      }),
    },
  ];

  return { general, groups };
}
