import { PageHeader } from "@/components/site/page-header";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { JsonLd } from "@/components/seo/json-ld";
import { getBrowseCategories } from "@/lib/catalog";
import { breadcrumbLd, socialMeta } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

const title = "Products";
const description =
  "Power transformers and the components inside them — radiators, cooling fans, tap changers, bushings, protection and more — with the manufacturers that supply each item.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/products" },
  ...socialMeta({ title, description, path: "/products" }),
};

export default async function ProductsPage() {
  const categories = await getBrowseCategories();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Products", path: "/products" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Products",
            itemListElement: categories.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: absoluteUrl(`/products/${c.slug}`) })),
          },
        ]}
      />
      <PageHeader
        image="products"
        crumbs={[{ label: "Products" }]}
        title="Products"
        description="Filter by category to find what you need, then open a product to see which manufacturers supply it."
      />
      <div className="container-page py-10 sm:py-14">
        {categories.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">Products are being added. Please check back soon.</p>
        ) : (
          <CatalogBrowser categories={categories} />
        )}
      </div>
    </>
  );
}
