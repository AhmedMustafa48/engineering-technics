import { Suspense } from "react";
import { PageHeader } from "@/components/site/page-header";
import { PanelStats } from "@/components/site/brand-panel";
import { ProductExplorer } from "@/components/catalog/product-explorer";
import { ProductGrid } from "@/components/catalog/product-grid";
import { getBrands, getCategories, getProductIndex } from "@/lib/catalog";

export const metadata = {
  title: "Products",
  description:
    "Browse protection relays, energy meters, transformers, tap changers, transformer accessories, insulation materials, fuses and more from 16 international manufacturers.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  const products = getProductIndex();
  const categories = getCategories().map(({ slug, name, icon }) => ({ slug, name, icon }));
  const brands = getBrands().map(({ slug, name }) => ({ slug, name }));

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Products" }]}
        title="Products"
        description="Search by name, model number or specification, or narrow down by category and brand."
        aside={<PanelStats items={[[products.length, "Products"], [categories.length, "Categories"], [brands.length, "Brands"]]} />}
      />
      <div className="container-page py-10 sm:py-14">
        {/* The explorer reads the URL on the client; the fallback is the full grid,
            so the prerendered HTML lists every product for crawlers and no-JS visitors. */}
        <Suspense fallback={<ProductGrid products={products} animate={false} />}>
          <ProductExplorer products={products} categories={categories} brands={brands} />
        </Suspense>
      </div>
    </>
  );
}
