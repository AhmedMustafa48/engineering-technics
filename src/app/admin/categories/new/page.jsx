import { AdminPage } from "@/components/admin/admin-ui";
import { CategoryForm } from "@/components/admin/category-form";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Add category" };

export default async function NewCategory() {
  await requireAdmin();
  return (
    <AdminPage eyebrow="Categories" title="Add category">
      <CategoryForm />
    </AdminPage>
  );
}
