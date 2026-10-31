// Starter content in the Product → Items → Suppliers shape, converted from the original catalogue
// (ET_Catalogue_2MB.pdf). It is the seed for Supabase (`npm run db:seed`) and the local fallback
// when Supabase is not configured. Once seeded, edit everything from /admin.
//
// Shape:
//   brands:   [{ slug, name, fullName, logo (images.json key), country?, description, contact? }]
//   products: [{ slug, name, icon, summary, description, image (images.json key),
//                items: [{ slug, name, description, image (key, optional default),
//                         suppliers: [{ slug (brand), image (key) }] }] }]
import { brands } from "./brands.js";
import { categories } from "./categories.js";
import { products as legacyProducts } from "./products.js";

// Each main product groups several of the original catalogue categories.
const GROUPS = [
  {
    slug: "power-transformer",
    name: "Power Transformer",
    icon: "Zap",
    summary: "Power and distribution transformers with the tap changers, bushings, cooling, protection and insulation that go into them.",
    categories: ["transformers", "tap-changers", "transformer-accessories", "bushings", "cooling-systems", "transformer-fluids", "insulation-materials", "core-steel"],
  },
  {
    slug: "protection-and-metering",
    name: "Protection & Metering",
    icon: "ShieldCheck",
    summary: "Protection relays and revenue-grade energy meters for networks, substations and industry.",
    categories: ["protection-relays", "energy-meters"],
  },
  {
    slug: "circuit-protection-and-testing",
    name: "Circuit Protection & Testing",
    icon: "Gauge",
    summary: "Fuses, neutral grounding resistors and thermal imaging cameras for protecting and inspecting electrical systems.",
    categories: ["circuit-protection", "grounding-resistors", "thermal-imaging"],
  },
];

const categoryName = new Map(categories.map((c) => [c.slug, c.name]));

const brandSlugs = new Set(brands.map((b) => b.slug));

// Only items from the suppliers listed in brands.js are kept; a product with no items left is dropped.
const seedProducts = GROUPS.map((g) => {
  const items = legacyProducts
    .filter((p) => g.categories.includes(p.category) && brandSlugs.has(p.brand))
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      description: p.description || p.summary || "",
      image: p.images?.[0] ?? null,
      // The photo came from this supplier's catalogue page, so it is that supplier's image.
      suppliers: [{ slug: p.brand, image: p.images?.[0] ?? null }],
    }));
  return {
    slug: g.slug,
    name: g.name,
    icon: g.icon,
    summary: g.summary,
    description: `${g.summary} Covers: ${g.categories.map((c) => categoryName.get(c)).join(", ")}.`,
    image: items.find((i) => i.image)?.image ?? null,
    items,
  };
});

export const seed = { brands, products: seedProducts.filter((p) => p.items.length > 0) };
