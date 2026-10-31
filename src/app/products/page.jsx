import { PageHeader } from "@/components/site/page-header";
import { ProductCard } from "@/components/catalog/product-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { getProducts } from "@/lib/catalog";
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
  const products = await getProducts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([{ name: "Products", path: "/products" }]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Products",
            itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: absoluteUrl(`/products/${p.slug}`) })),
          },
        ]}
      />
      <PageHeader
        image="products"
        crumbs={[{ label: "Products" }]}
        title="Products"
        description="Choose a product to see every item it is built from, and which manufacturers supply each one."
      />
      <div className="container-page py-10 sm:py-14">
        {products.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">Products are being added. Please check back soon.</p>
        ) : (
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} priority={i < 3} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </>
  );
}
