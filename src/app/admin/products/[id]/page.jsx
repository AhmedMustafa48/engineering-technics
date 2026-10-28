import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/product-form";
import { deleteProduct } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = { title: "Edit product" };

export default async function EditProduct({ params }) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createSessionClient();
  const [{ data: product }, { data: suppliers }] = await Promise.all([
    supabase.from("products").select("*, items(*, item_suppliers(brand_slug, sort_order, image))").eq("id", id).maybeSingle(),
    supabase.from("brands").select("slug, name").order("name"),
  ]);
  if (!product) notFound();
  const items = (product.items ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => ({
      id: i.id,
      name: i.name,
      slug: i.slug,
      description: i.description,
      image: i.image,
      suppliers: (i.item_suppliers ?? []).sort((a, b) => a.sort_order - b.sort_order).map((x) => ({ slug: x.brand_slug, image: x.image ?? null })),
    }));

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="flex gap-2">
          {product.published && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/products/${product.slug}`} target="_blank">
                <ExternalLink /> View live
              </Link>
            </Button>
          )}
          <form action={deleteProduct}>
            <input type="hidden" name="id" value={product.id} />
            <Button variant="outline" size="sm" className="text-destructive" formNoValidate>
              <Trash2 /> Delete
            </Button>
          </form>
        </div>
      </div>
      <ProductForm product={product} items={items} suppliers={suppliers ?? []} />
    </>
  );
}
