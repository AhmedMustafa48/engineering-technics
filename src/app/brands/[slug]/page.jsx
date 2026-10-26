import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { PanelStats } from "@/components/site/brand-panel";
import { ProductGrid } from "@/components/catalog/product-grid";
import { BrandLogo } from "@/components/catalog/brand-logo";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { SectionHeading } from "@/components/site/section-heading";
import { getBrand, getBrands, getProductsByBrand } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getBrands().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} Products`,
    description: brand.description,
    alternates: { canonical: `/brands/${slug}` },
  };
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const products = getProductsByBrand(slug);
  const categoryNames = [...new Set(products.map((p) => p.category.name))];

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/brands", label: "Brands" }, { label: brand.name }]}
        eyebrow={brand.country ? `Manufacturer · ${brand.country}` : "Manufacturer"}
        title={brand.fullName}
        description={brand.description}
        aside={
          <div className="flex flex-col gap-6 lg:items-end">
            <BrandLogo brand={brand} className="h-24 w-56 shadow-2xl" sizes="224px" />
            <PanelStats items={[[products.length, "Product lines"], [categoryNames.length, "Categories"]]} className="lg:border-l-0 lg:pl-0" />
          </div>
        }
      >
        <p className="mt-6 text-sm text-white/55">{categoryNames.join(" · ")}</p>
        <Button asChild variant="inverse" size="lg" className="mt-8">
          <Link href={`/contact?brand=${brand.slug}`}>
            <Mail /> Enquire about {brand.name}
          </Link>
        </Button>
      </PageHeader>

      <section aria-labelledby="brand-products" className="container-page py-12 sm:py-16">
        <SectionHeading id="brand-products" eyebrow={brand.name} title={`Products from ${brand.name}`} href="/products" linkLabel="All products" />
        <ProductGrid products={products} className="mt-10" />
      </section>
      <BrandMarquee brands={getBrands().filter((b) => b.slug !== brand.slug)} heading="More manufacturers we represent" />
    </>
  );
}
