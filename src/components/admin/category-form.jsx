"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { FolderTree, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategoryIcon } from "@/components/catalog/category-icon";
import { Field, FormCard, SaveBar, SlugField } from "@/components/admin/admin-ui";
import { saveCategory } from "@/app/admin/actions";
import { iconForCategory, slugify } from "@/lib/admin/derive";

export function CategoryForm({ category }) {
  const [state, action, pending] = useActionState(saveCategory, null);
  const [name, setName] = useState(category?.name ?? "");
  const [typedSlug, setTypedSlug] = useState(category?.slug ?? null);
  const slug = typedSlug ?? slugify(name);

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-5">
      {category && <input type="hidden" name="id" value={category.id} />}
      <input type="hidden" name="existing_image" value={JSON.stringify(category?.image ?? null)} />

      <FormCard icon={FolderTree} title="Category details" hint="e.g. Power Transformer. It appears in the left list on the website.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category name" htmlFor="name" required>
            <Input id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <SlugField value={slug} onChange={setTypedSlug} hint={`Page address: /products/${slug || "…"}`} />
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Icon</p>
            <span className="grid size-11 place-items-center rounded-md border bg-muted text-muted-foreground">
              <CategoryIcon name={iconForCategory(name)} className="size-5" />
            </span>
            <p className="text-xs text-muted-foreground">Set automatically from the category name.</p>
          </div>
          <Field label="Cover image (optional)" htmlFor="image_file" hint="Leave empty to use the first item's image.">
            {category?.image && (
              <Image src={category.image.src} alt="" width={96} height={72} className="mb-2 h-16 w-auto rounded-md border bg-white object-contain p-1" />
            )}
            <Input id="image_file" name="image_file" type="file" accept="image/*" />
          </Field>
        </div>
        <Field label="Short summary" htmlFor="summary" hint="Shown on cards and used as the default meta description.">
          <Textarea id="summary" name="summary" rows={2} defaultValue={category?.summary} />
        </Field>
        <Field label="Description" htmlFor="description">
          <Textarea id="description" name="description" rows={4} defaultValue={category?.description} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={category ? category.published : true} /> Published (visible on the site)
        </label>
      </FormCard>

      <FormCard icon={Search} index={1} title="SEO (optional)">
        <Field label="Meta title" htmlFor="seo_title" hint="Leave blank for an automatic title. Keep under ~60 characters.">
          <Input id="seo_title" name="seo_title" defaultValue={category?.seo_title ?? ""} maxLength={70} />
        </Field>
        <Field label="Meta description" htmlFor="seo_description" hint="Leave blank to use the summary. Keep under ~160 characters.">
          <Textarea id="seo_description" name="seo_description" rows={2} defaultValue={category?.seo_description ?? ""} maxLength={180} />
        </Field>
      </FormCard>

      <SaveBar error={state?.error}>
        <Button variant="brand" disabled={pending}>
          {pending ? "Saving…" : category ? "Save changes" : "Create category"}
        </Button>
      </SaveBar>
    </form>
  );
}
