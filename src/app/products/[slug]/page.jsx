import { notFound } from "next/navigation";
import { PageHeader } from "@/components/site/page-header";
import { ProductBrowser } from "@/components/catalog/product-browser";
import { JsonLd } from "@/components/seo/json-ld";
import { getProduct, getProducts } from "@/lib/catalog";
import { breadcrumbLd, productLd, socialMeta } from "@/lib/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const title = product.seoTitle || `${product.name} — items & suppliers`;
  const description = product.seoDescription || product.summary || `${product.name}: ${product.items.map((i) => i.name).slice(0, 6).join(", ")}.`;
  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
    ...socialMeta({ title, description, path: `/products/${slug}`, image: product.image }),
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();

  // Slim list for the left rail; only the open product ships its full item data to the client.
  const rail = all.map(({ slug, name, icon }) => ({ slug, name, icon }));
  const active = {
    slug: product.slug,
    name: product.name,
    icon: product.icon,
    items: product.items.map((i) => ({
      slug: i.slug,
      name: i.name,
      description: i.description,
      image: i.image,
      suppliers: i.suppliers.map(({ slug, name, fullName, logoImage, offerImage }) => ({ slug, name, fullName, logoImage, image: offerImage })),
    })),
  };

  return (
    <>
      <JsonLd data={[...productLd(product), breadcrumbLd([{ name: "Products", path: "/products" }, { name: product.name, path: `/products/${slug}` }])]} />
      <PageHeader
        image="products"
        crumbs={[{ href: "/products", label: "Products" }, { label: product.name }]}
        title={product.name}
        description={product.summary}
      />
      <div className="container-page py-10 sm:py-14">
        <ProductBrowser key={product.slug} products={rail} active={active} />
        {product.description && (
          <section aria-labelledby="about-heading" className="mt-16 max-w-3xl">
            <h2 id="about-heading" className="text-xl font-semibold">
              About {product.name}
            </h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{product.description}</p>
          </section>
        )}
      </div>
    </>
  );
}
