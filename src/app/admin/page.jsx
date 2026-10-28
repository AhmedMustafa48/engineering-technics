import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = { title: "Products" };

export default async function AdminProducts({ searchParams }) {
  await requireAdmin();
  const { q = "", saved, deleted } = await searchParams;
  const supabase = await createSessionClient();
  let query = supabase.from("products").select("id, slug, name, icon, published, image, updated_at, items(count)").order("updated_at", { ascending: false });
  if (q) query = query.ilike("name", `%${q.replace(/[%,]/g, "")}%`);
  const { data: products = [], error } = await query;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus /> Add product
          </Link>
        </Button>
      </div>
      {saved && <p className="mt-4 rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">Saved. The public site is updated.</p>}
      {deleted && <p className="mt-4 rounded-md bg-emerald-500/10 p-3 text-sm">Product deleted.</p>}
      {error && <p className="mt-4 text-sm text-destructive">{error.message}</p>}

      <form className="mt-5">
        <input name="q" defaultValue={q} placeholder="Search products…" className="h-9 w-full max-w-sm rounded-md border bg-background px-3 text-sm" />
      </form>

      <ul className="mt-5 divide-y rounded-xl border bg-card">
        {products.length === 0 && <li className="p-6 text-sm text-muted-foreground">No products yet.</li>}
        {products.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/products/${p.id}`} className="flex items-center gap-4 p-3 transition-colors hover:bg-muted/50">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-white">
                {p.image && <Image src={p.image.src} alt="" fill sizes="56px" className="object-contain p-1" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.items?.[0]?.count ?? 0} items · /{p.slug}
                </p>
              </div>
              <Badge variant={p.published ? "default" : "outline"}>{p.published ? "Published" : "Draft"}</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
