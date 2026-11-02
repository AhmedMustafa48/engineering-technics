import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Package } from "lucide-react";
import { AdminPage, Notice } from "@/components/admin/admin-ui";
import { CategoryForm } from "@/components/admin/category-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = { title: "Edit category" };

export default async function EditCategory({ params, searchParams }) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createSessionClient();
  const { data: category } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (!category) notFound();

  return (
    <AdminPage
      eyebrow="Categories"
      title={category.name}
      action={
        <>
          <Button asChild variant="inverse" size="sm">
            <Link href={`/admin/items?category=${category.id}`}>
              <Package /> Manage items
            </Link>
          </Button>
          {category.published && (
            <Button asChild variant="inverse-outline" size="sm">
              <Link href={`/products/${category.slug}`} target="_blank">
                <ExternalLink /> View live
              </Link>
            </Button>
          )}
          <form action={deleteCategory}>
            <input type="hidden" name="id" value={category.id} />
            <DeleteButton message={`Delete the category "${category.name}"? This cannot be undone.`} />
          </form>
        </>
      }
    >
      {error === "has-items" && <Notice tone="error">This category still has items. Move them to another category or delete them first.</Notice>}
      {error === "failed" && <Notice tone="error">The category could not be deleted. Please try again.</Notice>}
      <CategoryForm category={category} />
    </AdminPage>
  );
}
