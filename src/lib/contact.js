import { company } from "@/data/company";

// Most specific contact wins: product → brand → distributor. Contacts are not
// merged field-by-field, so a maker override never inherits the distributor phone.
export function getContact(product, brand) {
  const own = product?.contact ?? brand?.contact;
  return own ? { ...own, isDirect: true } : { ...company.contact, isDirect: false };
}

export function enquiryMessage(subject, url, to = company.name) {
  return `Hello ${to},\n\nI would like to enquire about: ${subject}${url ? `\n${url}` : ""}\n\nPlease share pricing and availability.\n\nThank you.`;
}

export function mailtoHref(email, subject, body) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${email}${query ? `?${query}` : ""}`;
}

export function telHref(phone) {
  if (!phone) return null;
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function companyMapsUrl() {
  const { street, city, country } = company.officeAddress;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${street}, ${city}, ${country}`)}`;
}

export function whatsappHref(number, text) {
  if (!number) return null;
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
