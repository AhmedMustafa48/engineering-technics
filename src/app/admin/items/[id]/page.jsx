import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { AdminPage, Notice } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { ItemForm } from "@/components/admin/item-form";
import { Button } from "@/components/ui/button";
import { deleteItem } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { listCategories } from "@/lib/admin/catalog";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = { title: "Edit item" };

export default async function EditItem({ params, searchParams }) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createSessionClient();
  const [{ data: row }, { categories }, { data: suppliers }] = await Promise.all([
    supabase.from("items").select("*, item_suppliers(brand_slug, sort_order, image)").eq("id", id).maybeSingle(),
    listCategories(supabase),
    supabase.from("brands").select("slug, name").order("name"),
  ]);
  if (!row) notFound();

  const category = categories.find((c) => c.id === row.product_id);
  const item = {
    id: row.id,
    product_id: row.product_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image: row.image,
    suppliers: (row.item_suppliers ?? []).sort((a, b) => a.sort_order - b.sort_order).map((x) => ({ slug: x.brand_slug, image: x.image ?? null })),
  };

  return (
    <AdminPage
      eyebrow={category?.name ?? "Items"}
      title={row.name}
      image="catalogue"
      action={
        <>
          {category?.published && (
            <Button asChild variant="inverse-outline" size="sm">
              <Link href={`/products/${category.slug}#item-${row.slug}`} target="_blank">
                <ExternalLink /> View live
              </Link>
            </Button>
          )}
          <form action={deleteItem}>
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="category" value={row.product_id} />
            <DeleteButton message={`Delete "${row.name}"? This cannot be undone.`} />
          </form>
        </>
      }
    >
      {error === "failed" && <Notice tone="error">The item could not be deleted. Please try again.</Notice>}
      <ItemForm item={item} categories={categories} suppliers={suppliers ?? []} />
    </AdminPage>
  );
}
