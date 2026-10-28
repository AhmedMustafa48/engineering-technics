import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = { title: "New product" };

export default async function NewProduct() {
  await requireAdmin();
  const supabase = await createSessionClient();
  const { data: suppliers } = await supabase.from("brands").select("slug, name").order("name");
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Add product</h1>
      <ProductForm suppliers={suppliers ?? []} />
    </>
  );
}
