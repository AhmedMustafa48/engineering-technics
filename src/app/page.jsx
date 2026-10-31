import { SectionHeading } from "@/components/site/section-heading";
import { BrandPanel } from "@/components/site/brand-panel";
import { Hero } from "@/components/home/hero";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { ProductShowcase } from "@/components/home/product-showcase";
import { HowItWorks } from "@/components/home/how-it-works";
import { CatalogueTeaser } from "@/components/home/catalogue-teaser";
import { getBrands, getItemCount, getProducts } from "@/lib/catalog";
import { formatBytes, getCatalogue } from "@/lib/catalogue";

export const revalidate = 3600;

// Catalogue pages for current suppliers only: SW Industry, COMEM and Ares Trafo.
const TEASER_PAGES = [10, 8, 11];

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

      <section aria-labelledby="products-heading" className="container-page py-16 sm:py-20">
        <SectionHeading
          id="products-heading"
          eyebrow="Our products"
          title={
            <>
              Everything inside the <span className="text-gradient">transformer</span>
            </>
          }
          href="/products"
          linkLabel="All products"
        />
        <ProductShowcase products={products} />
      </section>

      <BrandPanel as="section" aria-labelledby="how-heading" lines={false} className="rounded-none" innerClassName="container-page py-20 sm:py-24">
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title={
            <span className="text-white">
              One supplier, <span className="text-gradient-bright">the whole transformer.</span>
            </span>
          }
          description="Pick a product, tick the items you need, see who makes them. One enquiry reaches every maker we represent."
          center
          inverse
        />
        <div className="mt-14">
          <HowItWorks />
        </div>
      </BrandPanel>

      <section
        aria-labelledby="catalogue-heading"
        className="bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-sky-950/50 dark:via-background dark:to-indigo-950/50"
      >
        <div className="container-page py-20 sm:py-24">
          <CatalogueTeaser
            pages={TEASER_PAGES.map((n) => catalogue.pages[n - 1])}
            pageCount={catalogue.pages.length}
            pdf={catalogue.pdf}
            pdfSize={formatBytes(catalogue.pdfBytes)}
          />
        </div>
      </section>
    </>
  );
}
