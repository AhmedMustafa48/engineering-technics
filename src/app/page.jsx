import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { ProductCard } from "@/components/catalog/product-card";
import { Hero } from "@/components/home/hero";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { CategoryBento } from "@/components/home/category-bento";
import { HowItWorks } from "@/components/home/how-it-works";
import { CatalogueTeaser } from "@/components/home/catalogue-teaser";
import { getBrands, getCategories, getFeaturedProducts, getProduct, getProducts } from "@/lib/catalog";
import { formatBytes, getCatalogue } from "@/lib/catalogue";

const SHOWCASE = [
  "elprom-rs93-on-load-tap-changer",
  "multilin-345-transformer-protection-relay",
  "comem-buchholz-relay",
  "power-dry-type-cast-resin-transformers",
];

export default function HomePage() {
  const products = getProducts();
  const categories = getCategories();
  const brands = getBrands();
  const featured = getFeaturedProducts().slice(0, 8);
  const catalogue = getCatalogue();

  const showcase = SHOWCASE.map(getProduct)
    .filter((p) => p?.images.length)
    .map((p) => ({ slug: p.slug, name: p.name, brand: p.brand.name, image: p.images[0] }));

  return (
    <>
      <Hero
        stats={{ brands: brands.length, categories: categories.length, products: products.length }}
        categories={categories.map(({ slug, name }) => ({ slug, name }))}
        showcase={showcase}
      />

      <BrandMarquee brands={brands} />

      <section aria-labelledby="categories-heading" className="container-page py-12 sm:py-16">
        <SectionHeading
          id="categories-heading"
          eyebrow="Product range"
          title="Browse by category"
          href="/products"
          linkLabel="All products"
        />
        <div className="mt-10">
          <CategoryBento categories={categories} />
        </div>
      </section>

      <section aria-labelledby="featured-heading" className="mt-12 border-y bg-muted/40">
        <div className="container-page py-20 sm:py-24">
          <SectionHeading
            id="featured-heading"
            eyebrow="Featured"
            title="Popular product lines"
            href="/products"
            linkLabel="View all"
          />
          <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="container-page py-20 sm:py-28">
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="One supplier, the whole transformer."
          description="From silicon steel and pressboard to Buchholz relays and protection IEDs — one enquiry reaches every maker we represent."
          center
        />
        <div className="mt-14">
          <HowItWorks />
        </div>
      </section>

      <section aria-labelledby="catalogue-heading" className="border-t bg-gradient-to-b from-muted/50 to-transparent">
        <div className="container-page py-20 sm:py-24">
          <CatalogueTeaser
            pages={[catalogue.pages[1], catalogue.pages[7], catalogue.pages[2]]}
            pageCount={catalogue.pages.length}
            brandCount={brands.length}
            pdf={catalogue.pdf}
            pdfSize={formatBytes(catalogue.pdfBytes)}
          />
        </div>
      </section>
    </>
  );
}
