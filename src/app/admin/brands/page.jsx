import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandForm } from "@/components/admin/entity-form";
import { deleteBrand } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = { title: "Suppliers" };

export default async function AdminBrands({ searchParams }) {
  await requireAdmin();
  const { edit, saved, error } = await searchParams;
  const supabase = await createSessionClient();
  const { data: brands = [] } = await supabase.from("brands").select("*").order("name");
  const current = edit && edit !== "new" ? brands.find((b) => b.slug === edit) : null;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Suppliers</h1>
        <Button asChild>
          <Link href="/admin/brands?edit=new">
            <Plus /> Add supplier
          </Link>
        </Button>
      </div>
      {saved && <p className="mt-4 rounded-md bg-emerald-500/10 p-3 text-sm">Saved.</p>}
      {error && <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">This supplier is still used by items. Remove it from those items first.</p>}

      {edit && (
        <div className="mt-5">
          <BrandForm key={edit} brand={current} />
        </div>
      )}

      <ul className="mt-5 divide-y rounded-xl border bg-card">
        {brands.map((b) => (
          <li key={b.slug} className="flex items-center gap-3 p-3">
            <Link href={`/admin/brands?edit=${b.slug}`} className="min-w-0 flex-1 hover:underline">
              <span className="font-medium">{b.name}</span> <span className="text-xs text-muted-foreground">/{b.slug}</span>
            </Link>
            <form action={deleteBrand}>
              <input type="hidden" name="slug" value={b.slug} />
              <Button variant="ghost" size="icon" aria-label={`Delete ${b.name}`}><Trash2 /></Button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
