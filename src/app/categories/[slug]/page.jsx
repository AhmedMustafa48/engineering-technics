import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/page-header";
import { PanelStats } from "@/components/site/brand-panel";
import { ProductGrid } from "@/components/catalog/product-grid";
import { CategoryIcon } from "@/components/catalog/category-icon";
import { CategoryBento } from "@/components/home/category-bento";
import { SectionHeading } from "@/components/site/section-heading";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const products = getProductsByCategory(slug);
  const brandNames = [...new Set(products.map((p) => p.brand.name))];
  const others = getCategories().filter((c) => c.slug !== slug);

  return (
    <>
      <PageHeader
        crumbs={[{ href: "/products", label: "Products" }, { label: category.name }]}
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-md bg-white/10 text-cyan-300">
              <CategoryIcon name={category.icon} className="size-4" />
            </span>
            Category
          </span>
        }
        title={category.name}
        description={category.description}
        aside={<PanelStats items={[[products.length, products.length === 1 ? "Product" : "Products"], [brandNames.length, brandNames.length === 1 ? "Brand" : "Brands"]]} />}
      >
        <p className="mt-6 text-sm text-white/55">From {brandNames.join(" · ")}</p>
      </PageHeader>

      <div className="container-page py-10 sm:py-14">
        <ProductGrid products={products} />

        <section aria-labelledby="other-categories" className="mt-24">
          <SectionHeading id="other-categories" eyebrow="Keep exploring" title="Other categories" href="/products" linkLabel="All products" />
          <div className="mt-10">
            <CategoryBento categories={others} featureFirst={false} />
          </div>
        </section>
      </div>
    </>
  );
}
