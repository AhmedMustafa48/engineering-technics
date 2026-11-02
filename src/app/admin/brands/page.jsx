import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { AdminPage, Notice } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { BrandForm } from "@/components/admin/entity-form";
import { Button } from "@/components/ui/button";
import { deleteBrand } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = { title: "Suppliers" };

export default async function AdminBrands({ searchParams }) {
  await requireAdmin();
  const { edit, saved, deleted, error } = await searchParams;
  const supabase = await createSessionClient();
  const { data } = await supabase.from("brands").select("*").order("name");
  const brands = data ?? [];
  const current = edit && edit !== "new" ? brands.find((b) => b.slug === edit) : null;

  return (
    <AdminPage
      eyebrow="Catalogue"
      title="Suppliers"
      description="The manufacturers you can link to items."
      image="suppliers"
      action={
        <Button asChild variant="brand">
          <Link href="/admin/brands?edit=new">
            <Plus /> Add supplier
          </Link>
        </Button>
      }
    >
      {saved && <Notice>Saved. The public site is updated.</Notice>}
      {deleted && <Notice>Supplier deleted.</Notice>}
      {error && <Notice tone="error">This supplier is still used by items. Remove it from those items first.</Notice>}

      {edit && (
        <div className="mb-8">
          <BrandForm key={edit} brand={current} />
        </div>
      )}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <li key={b.slug} className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
            <span className="grid h-24 place-items-center border-b bg-white px-5">
              {b.logo ? (
                <Image src={b.logo.src} alt="" width={b.logo.width} height={b.logo.height} sizes="200px" className="h-12 w-auto max-w-full object-contain" />
              ) : (
                <span className="text-xl font-bold text-slate-900">{b.name}</span>
              )}
            </span>
            <div className="flex items-center gap-2 p-3 pl-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{b.name}</p>
                <p className="truncate text-xs text-muted-foreground">/{b.slug}</p>
              </div>
              <Button asChild variant="ghost" size="icon" aria-label={`Edit ${b.name}`}>
                <Link href={`/admin/brands?edit=${b.slug}`}>
                  <Pencil />
                </Link>
              </Button>
              <form action={deleteBrand}>
                <input type="hidden" name="slug" value={b.slug} />
                <DeleteButton iconOnly label={`Delete ${b.name}`} message={`Delete the supplier "${b.name}"? This cannot be undone.`} />
              </form>
            </div>
          </li>
        ))}
      </ul>
    </AdminPage>
  );
}
