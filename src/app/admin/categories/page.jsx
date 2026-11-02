import Image from "next/image";
import Link from "next/link";
import { FolderTree, Plus } from "lucide-react";
import { AdminPage, Notice } from "@/components/admin/admin-ui";
import { IconTile } from "@/components/site/icon-tile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import { listCategories } from "@/lib/admin/catalog";
import { accent } from "@/lib/accents";
import { createSessionClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export const metadata = { title: "Categories" };

export default async function AdminCategories({ searchParams }) {
  await requireAdmin();
  const { saved, deleted } = await searchParams;
  const { categories, error } = await listCategories(await createSessionClient());

  return (
    <AdminPage
      eyebrow="Catalogue"
      title="Categories"
      description="Each category groups items and appears in the left list on the website."
      action={
        <Button asChild variant="brand">
          <Link href="/admin/categories/new">
            <Plus /> Add category
          </Link>
        </Button>
      }
    >
      {saved && <Notice>Saved. The public site is updated.</Notice>}
      {deleted && <Notice>Category deleted.</Notice>}
      {error && <Notice tone="error">{error.message}</Notice>}

      {categories.length === 0 && <p className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">No categories yet.</p>}
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <li key={c.id}>
            <Link
              href={`/admin/categories/${c.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
            >
              <span className={cn("relative grid aspect-[16/9] place-items-center overflow-hidden", accent(c.index).soft)}>
                {c.image ? (
                  <Image src={c.image.src} alt="" fill sizes="(min-width: 1024px) 400px, 50vw" className="object-contain p-3 mix-blend-multiply" />
                ) : (
                  <IconTile icon={FolderTree} index={c.index} />
                )}
              </span>
              <span className="flex flex-1 flex-col gap-1 p-4">
                <span className="flex items-start justify-between gap-2">
                  <span className="font-semibold leading-snug">{c.name}</span>
                  <Badge variant={c.published ? "default" : "outline"}>{c.published ? "Published" : "Draft"}</Badge>
                </span>
                <span className="text-xs text-muted-foreground">
                  {c.itemCount} {c.itemCount === 1 ? "item" : "items"} · /{c.slug}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </AdminPage>
  );
}
