// Distributor details, taken from the footer of ET_Catalogue_2MB.pdf.
// The catalogue lists no manufacturer contacts, so every enquiry routes here
// unless a product or brand defines its own `contact` override.
export const company = {
  name: "Engineering Technics",
  legalName: "Engineering Technics",
  tagline: "Power transformer components, protection & insulation — sourced from world-class makers.",
  description:
    "Engineering Technics is a Lahore-based supplier of protection relays, energy meters, transformers, tap changers, transformer accessories, insulation materials and circuit protection from leading international manufacturers.",
  address: {
    street: "67-A, New Muslim Town",
    city: "Lahore",
    country: "Pakistan",
    countryCode: "PK",
  },
  contact: {
    email: "sales@enggtech.net",
    phone: "042-35774702",
    phoneIntl: "+924235774702",
    fax: "042-35774800",
    // Not in the catalogue yet. WhatsApp links stay hidden while this is empty.
    // Use international digits only, e.g. "923001234567".
    whatsapp: "",
  },
};
