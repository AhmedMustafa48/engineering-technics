import { SectionHeading } from "@/components/site/section-heading";
import { ProductCard } from "@/components/catalog/product-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Hero } from "@/components/home/hero";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { HowItWorks } from "@/components/home/how-it-works";
import { CatalogueTeaser } from "@/components/home/catalogue-teaser";
import { getBrands, getItemCount, getProducts } from "@/lib/catalog";
import { formatBytes, getCatalogue } from "@/lib/catalogue";

export const revalidate = 3600;

export default async function HomePage() {
  const [products, brands, itemCount] = await Promise.all([getProducts(), getBrands(), getItemCount()]);
  const catalogue = getCatalogue();

  return (
    <>
      <Hero
        stats={{ products: products.length, items: itemCount }}
        products={products.map(({ slug, name }) => ({ slug, name }))}
      />

      <BrandMarquee brands={brands} />

      <section aria-labelledby="products-heading" className="container-page py-12 sm:py-16">
        <SectionHeading id="products-heading" eyebrow="Our products" title="Everything inside the product" href="/products" linkLabel="All products" />
        <Stagger className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <StaggerItem key={p.slug}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section aria-labelledby="how-heading" className="container-page py-20 sm:py-28">
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="One supplier, the whole transformer."
          description="Pick a product, tick the items you need, see who makes them — then one enquiry reaches every maker we represent."
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
            pdf={catalogue.pdf}
            pdfSize={formatBytes(catalogue.pdfBytes)}
          />
        </div>
      </section>
    </>
  );
}
