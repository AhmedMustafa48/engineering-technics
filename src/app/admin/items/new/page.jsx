import { AdminPage } from "@/components/admin/admin-ui";
import { ItemForm } from "@/components/admin/item-form";
import { requireAdmin } from "@/lib/admin/auth";
import { listCategories } from "@/lib/admin/catalog";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = { title: "Add item" };

export default async function NewItem({ searchParams }) {
  await requireAdmin();
  const { category = "" } = await searchParams;
  const supabase = await createSessionClient();
  const [{ categories }, { data: suppliers }] = await Promise.all([
    listCategories(supabase),
    supabase.from("brands").select("slug, name").order("name"),
  ]);
  return (
    <AdminPage eyebrow="Items" title="Add item" image="catalogue">
      <ItemForm categories={categories} suppliers={suppliers ?? []} defaultCategory={categories.some((c) => c.id === category) ? category : ""} />
    </AdminPage>
  );
}
