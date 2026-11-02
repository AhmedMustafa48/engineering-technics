import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { AdminPage, Notice } from "@/components/admin/admin-ui";
import { ItemList } from "@/components/admin/item-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireAdmin } from "@/lib/admin/auth";
import { ITEM_ROW, listCategories, toListItem } from "@/lib/admin/catalog";
import { createSessionClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata = { title: "Items" };

function FilterPill({ href, active, children }) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "border-brand bg-brand text-[#0b1628]" : "bg-card hover:bg-accent",
      )}
    >
      {children}
    </Link>
  );
}

export default async function AdminItems({ searchParams }) {
  await requireAdmin();
  const { category = "", q = "", saved, deleted } = await searchParams;
  const supabase = await createSessionClient();
  const { categories, error } = await listCategories(supabase);

  let query = supabase.from("items").select(ITEM_ROW).order("sort_order").order("name");
  if (category) query = query.eq("product_id", category);
  if (q) query = query.ilike("name", `%${q.replace(/[%,]/g, "")}%`);
  const { data: rows, error: itemsError } = await query;
  const items = (rows ?? []).map((row) => toListItem(row, categories)).sort((a, b) => a.category.index - b.category.index);

  return (
    <AdminPage
      eyebrow="Catalogue"
      title="Items"
      description="Every item belongs to a category and lists the suppliers that offer it."
      image="catalogue"
      action={
        <Button asChild variant="brand">
          <Link href={category ? `/admin/items/new?category=${category}` : "/admin/items/new"}>
            <Plus /> Add item
          </Link>
        </Button>
      }
    >
      {saved && <Notice>Saved. The public site is updated.</Notice>}
      {deleted && <Notice>Item deleted.</Notice>}
      {(error || itemsError) && <Notice tone="error">{(error ?? itemsError).message}</Notice>}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterPill href="/admin/items" active={!category}>
            All
          </FilterPill>
          {categories.map((c) => (
            <FilterPill key={c.id} href={`/admin/items?category=${c.id}`} active={category === c.id}>
              {c.name}
            </FilterPill>
          ))}
        </div>
        <form className="flex w-full gap-2 sm:w-72">
          {category && <input type="hidden" name="category" value={category} />}
          <Input name="q" defaultValue={q} placeholder="Search items…" aria-label="Search items" />
          <Button variant="outline" size="icon" aria-label="Search">
            <Search />
          </Button>
        </form>
      </div>

      {category && !q && items.length > 1 && <p className="mb-3 text-xs text-muted-foreground">Use the arrows to set the order shown on the website.</p>}
      <ItemList items={items} sortable={Boolean(category) && !q} />
    </AdminPage>
  );
}
