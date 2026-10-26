import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { BrandPanel } from "@/components/site/brand-panel";
import { PanelBreadcrumb } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { FadeIn } from "@/components/motion/fade-in";
import { CategoryIcon } from "@/components/catalog/category-icon";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ProductGallery } from "@/components/product/product-gallery";
import { EnquiryButtons, EnquiryPanel, MobileEnquiryBar, getEnquiryLinks } from "@/components/product/enquiry";
import { HighlightList, SpecList, SpecTable, TagList } from "@/components/product/spec-blocks";
import { SectionNav } from "@/components/product/section-nav";
import { getProduct, getProducts, getRelatedProducts } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const image = product.images[0];
  return {
    title: `${product.name} — ${product.brand.name}`,
    description: product.summary,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: `${product.brand.name} ${product.name}`,
      description: product.summary,
      type: "website",
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
  };
}

function Section({ id, title, children }) {
  return (
    <Reveal as="section" id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-36">
      <h2 id={`${id}-heading`} className="mb-5 text-2xl font-semibold">
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const { brand, category } = product;
  const related = getRelatedProducts(product, 3);
  const keySpecs = product.specs.slice(0, 4);
  const sections = [
    { id: "overview", label: "Overview" },
    product.specs.length > 0 && { id: "specifications", label: "Specifications" },
    product.tables.length > 0 && { id: "technical-data", label: "Technical data" },
    product.standards.length > 0 && { id: "standards", label: "Standards" },
    { id: "enquire", label: "Enquire" },
  ].filter(Boolean);

  return (
    <article>
      {/* Hero on the brand panel: gallery + key facts */}
      <div className="container-page pt-3 sm:pt-5">
        <BrandPanel lines={false} glow="right" innerClassName="px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
          <FadeIn>
            <PanelBreadcrumb
              crumbs={[
                { href: "/products", label: "Products" },
                { href: `/categories/${category.slug}`, label: category.name },
                { label: product.name },
              ]}
            />
          </FadeIn>

          <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <FadeIn delay={0.05}>
              <ProductGallery images={product.images} title={product.name} categoryIcon={category.icon} onDark />
            </FadeIn>

            <FadeIn delay={0.1} className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Link
                  href={`/brands/${brand.slug}`}
                  className="rounded-md bg-white px-2 py-1 text-xs font-semibold tracking-wide text-slate-900 hover:bg-white/90"
                >
                  {brand.name}
                </Link>
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs font-medium text-white/75 hover:text-white"
                >
                  <CategoryIcon name={category.icon} className="size-3.5" />
                  {category.name}
                </Link>
              </div>

              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{product.name}</h1>
              <p className="mt-4 text-lg leading-relaxed text-white/70">{product.summary}</p>

              {product.models.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">Models</p>
                  <ul className="flex flex-wrap gap-2">
                    {product.models.map((m) => (
                      <li key={m} className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-xs font-medium text-white/85">
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {keySpecs.length > 0 && (
                <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
                  {keySpecs.map((s) => (
                    <div key={s.label} className="bg-[#0e1b31] p-4 [&:last-child:nth-child(odd)]:col-span-2">
                      <dt className="text-xs text-white/50">{s.label}</dt>
                      <dd className="mt-1 text-sm font-semibold">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <EnquiryButtons links={getEnquiryLinks(product)} tone="inverse" className="mt-8 hidden flex-wrap gap-3 lg:flex" />

              {product.cataloguePage && (
                <Link
                  href={`/catalogue?page=${product.cataloguePage}`}
                  className="mt-6 inline-flex items-center gap-2 self-start text-sm font-medium text-cyan-300 hover:underline"
                >
                  <BookOpen className="size-4" /> View on catalogue page {product.cataloguePage}
                </Link>
              )}
            </FadeIn>
          </div>
        </BrandPanel>
      </div>

      {/* Details + sticky enquiry panel */}
      <div className="container-page grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-16">
        <div className="min-w-0">
          <SectionNav sections={sections} />
          <div className="space-y-14">
          <Section id="overview" title="Overview">
            <p className="max-w-prose leading-relaxed text-muted-foreground">{product.description}</p>
            {product.highlights.length > 0 && (
              <div className="mt-8">
                <HighlightList items={product.highlights} />
              </div>
            )}
          </Section>

          {product.specs.length > 0 && (
            <Section id="specifications" title="Specifications">
              <SpecList specs={product.specs} />
            </Section>
          )}

          {product.tables.length > 0 && (
            <Section id="technical-data" title="Technical data">
              <div className="space-y-6">
                {product.tables.map((t) => (
                  <SpecTable key={t.title} table={t} />
                ))}
              </div>
            </Section>
          )}

          {product.standards.length > 0 && (
            <Section id="standards" title="Standards">
              <TagList items={product.standards} />
            </Section>
          )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <EnquiryPanel product={product} />
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-8 border-y bg-muted/40">
          <div className="container-page py-14 sm:py-20">
            <SectionHeading
              id="related-heading"
              eyebrow="You may also need"
              title="Related products"
              href={`/categories/${category.slug}`}
              linkLabel={`More ${category.name}`}
            />
            <ProductGrid products={related} className="mt-10" />
          </div>
        </section>
      )}

      <MobileEnquiryBar product={product} />
    </article>
  );
}
