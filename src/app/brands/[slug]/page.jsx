import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { PanelStats } from "@/components/site/brand-panel";
import { BrandLogo } from "@/components/catalog/brand-logo";
import { ImagePlaceholder } from "@/components/catalog/product-card";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { SectionHeading } from "@/components/site/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd, socialMeta } from "@/lib/seo";
import { getBrand, getBrands, getItemsByBrand, getProducts } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getBrands()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) return {};
  const title = `${brand.name} — items supplied`;
  return {
    title,
    description: brand.description,
    alternates: { canonical: `/brands/${slug}` },
    ...socialMeta({ title, description: brand.description, path: `/brands/${slug}`, image: brand.logoImage }),
  };
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  const [items, products, brands] = await Promise.all([getItemsByBrand(slug), getProducts(), getBrands()]);
  const groups = products.map((p) => ({ product: p, items: items.filter((i) => i.productSlug === p.slug) })).filter((g) => g.items.length);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Suppliers", path: "/brands" }, { name: brand.name, path: `/brands/${slug}` }]),
          { "@context": "https://schema.org", "@type": "Brand", name: brand.fullName, description: brand.description, url: absoluteUrl(`/brands/${slug}`), logo: brand.logoImage?.src },
        ]}
      />
      <PageHeader
        image="suppliers"
        crumbs={[{ href: "/brands", label: "Suppliers" }, { label: brand.name }]}
        eyebrow={brand.country ? `Manufacturer · ${brand.country}` : "Manufacturer"}
        title={brand.fullName}
        description={brand.description}
        aside={
          <div className="flex flex-col gap-6">
            {brand.website ? (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${brand.fullName} official website (opens in a new tab)`}
                className="block transition-transform hover:-translate-y-0.5"
              >
                <BrandLogo brand={brand} className="h-24 w-56 shadow-2xl" sizes="224px" />
              </a>
            ) : (
              <BrandLogo brand={brand} className="h-24 w-56 shadow-2xl" sizes="224px" />
            )}
            <PanelStats items={[[items.length, "Items supplied"], [groups.length, groups.length === 1 ? "Product" : "Products"]]} />
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="inverse" size="lg">
            <Link href={`/contact?brand=${brand.slug}`}>
              <Mail /> Enquire about {brand.name}
            </Link>
          </Button>
          {brand.website && (
            <Button asChild variant="inverse-outline" size="lg">
              <a href={brand.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink /> Official website
              </a>
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="container-page space-y-14 py-12 sm:py-16">
        {groups.length === 0 && <p className="text-muted-foreground">Items from this supplier are being added.</p>}
        {groups.map(({ product, items }) => (
          <section key={product.slug} aria-labelledby={`g-${product.slug}`}>
            <SectionHeading id={`g-${product.slug}`} eyebrow={brand.name} title={product.name} href={`/products/${product.slug}`} linkLabel="View product" />
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/products/${product.slug}#item-${item.slug}`}
                    className="spotlight flex h-full gap-4 rounded-2xl border bg-card p-3 transition-shadow hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-white">
                      {item.image ? <Image src={item.image.src} alt={item.image.alt} fill sizes="96px" className="object-contain p-2" /> : <ImagePlaceholder icon={product.icon} />}
                    </div>
                    <div className="min-w-0 py-1">
                      <h3 className="line-clamp-2 font-semibold leading-snug">{item.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <BrandMarquee brands={brands.filter((b) => b.slug !== brand.slug)} heading="More suppliers" linked />
    </>
  );
}
