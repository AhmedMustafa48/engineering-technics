import Link from "next/link";
import { ArrowRight, Factory, FolderTree, Package, Plus } from "lucide-react";
import { AdminPage, Notice } from "@/components/admin/admin-ui";
import { ItemList } from "@/components/admin/item-list";
import { IconTile } from "@/components/site/icon-tile";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import { ITEM_ROW, listCategories, toListItem } from "@/lib/admin/catalog";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = await createSessionClient();
  const [{ categories, error }, itemCount, supplierCount, recent] = await Promise.all([
    listCategories(supabase),
    supabase.from("items").select("id", { count: "exact", head: true }),
    supabase.from("brands").select("slug", { count: "exact", head: true }),
    supabase.from("items").select(ITEM_ROW).order("updated_at", { ascending: false }).limit(5),
  ]);

  const sections = [
    { icon: FolderTree, label: "Categories", count: categories.length, href: "/admin/categories", add: "/admin/categories/new" },
    { icon: Package, label: "Items", count: itemCount.count ?? 0, href: "/admin/items", add: "/admin/items/new" },
    { icon: Factory, label: "Suppliers", count: supplierCount.count ?? 0, href: "/admin/brands", add: "/admin/brands?edit=new" },
  ];

  return (
    <AdminPage eyebrow="Admin panel" title="Dashboard" description="Add categories first, then add items under them and link their suppliers.">
      {error && <Notice tone="error">{error.message}</Notice>}

      <ul className="grid gap-5 sm:grid-cols-3">
        {sections.map(({ icon, label, count, href, add }, i) => (
          <li key={label} className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <IconTile icon={icon} index={i} />
              <p className="text-3xl font-bold tabular-nums">{count}</p>
            </div>
            <h2 className="mt-4 font-semibold">{label}</h2>
            <div className="mt-3 flex items-center gap-2">
              <Button asChild variant="brand" size="sm">
                <Link href={add}>
                  <Plus /> Add
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href={href}>
                  Manage <ArrowRight />
                </Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <section aria-labelledby="recent-heading" className="mt-10">
        <h2 id="recent-heading" className="mb-4 text-lg font-bold">
          Recently updated <span className="text-gradient">items</span>
        </h2>
        <ItemList items={(recent.data ?? []).map((row) => toListItem(row, categories))} />
      </section>
    </AdminPage>
  );
}
