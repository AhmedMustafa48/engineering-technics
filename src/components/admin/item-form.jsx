"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FolderTree, Package, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormCard, SaveBar, SlugField, selectClass } from "@/components/admin/admin-ui";
import { saveItem } from "@/app/admin/actions";
import { slugify } from "@/lib/admin/derive";
import { cn } from "@/lib/utils";

// item.suppliers = [{ slug, image }]: picked from the existing suppliers; `image` only on older links.
export function ItemForm({ item, categories, suppliers, defaultCategory = "" }) {
  const [state, action, pending] = useActionState(saveItem, null);
  const [name, setName] = useState(item?.name ?? "");
  const [typedSlug, setTypedSlug] = useState(item?.slug ?? null);
  const [image, setImage] = useState(item?.image ?? null);
  const [offers, setOffers] = useState(item?.suppliers ?? []);

  const toggle = (supplier) =>
    setOffers((list) =>
      list.some((x) => x.slug === supplier)
        ? list.filter((x) => x.slug !== supplier)
        : [...list, item?.suppliers?.find((x) => x.slug === supplier) ?? { slug: supplier, image: null }],
    );
  const clearPhoto = (supplier) => setOffers((list) => list.map((x) => (x.slug === supplier ? { ...x, image: null } : x)));
  const saved = offers.filter((x) => x.image);

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-5">
      {item && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="existing_image" value={JSON.stringify(image)} />
      <input type="hidden" name="suppliers" value={JSON.stringify(offers)} />

      <FormCard icon={FolderTree} title="Category" hint="Choose the category this item belongs under.">
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No categories yet.{" "}
            <Link href="/admin/categories/new" className="font-medium text-primary hover:underline">
              Add a category first
            </Link>
            .
          </p>
        ) : (
          <Field label="Category" htmlFor="product_id" required>
            <select id="product_id" name="product_id" required defaultValue={item?.product_id ?? defaultCategory} className={selectClass}>
              <option value="" disabled>
                Select a category…
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        )}
      </FormCard>

      <FormCard icon={Package} index={2} title="Item details" hint="e.g. Radiators, Cooling fans.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Item name" htmlFor="name" required>
            <Input id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <SlugField
            value={typedSlug ?? slugify(name)}
            onChange={setTypedSlug}
            hint="Must be unique in its category. For the same item from another supplier, add the supplier: buchholz-relay-ares."
          />
        </div>
        <Field label="Description" htmlFor="description" hint="Long text is collapsed on the site with a “Show more” button.">
          <Textarea id="description" name="description" rows={5} defaultValue={item?.description} />
        </Field>
        <Field label="Item image (optional)" htmlFor="image_file" hint="Shown on the website for every supplier of this item.">
          {image && (
            <div className="mb-2 flex items-center gap-3">
              <Image src={image.src} alt="" width={96} height={72} className="h-16 w-auto rounded-md border bg-white object-contain p-1" />
              <Button type="button" size="xs" variant="outline" onClick={() => setImage(null)}>
                Remove image
              </Button>
            </div>
          )}
          <Input id="image_file" name="image_file" type="file" accept="image/*" />
        </Field>
      </FormCard>

      <FormCard icon={Factory} index={1} title="Suppliers" hint="Tick every supplier that offers this item. Their logo and details come from the Suppliers page.">
        {suppliers.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No suppliers yet.{" "}
            <Link href="/admin/brands?edit=new" className="font-medium text-primary hover:underline">
              Add a supplier
            </Link>
            .
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {suppliers.map((s) => {
              const on = offers.some((x) => x.slug === s.slug);
              return (
                <li key={s.slug}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                      on ? "border-brand bg-brand-soft font-medium text-brand-foreground" : "hover:bg-accent",
                    )}
                  >
                    <input type="checkbox" className="size-3.5" checked={on} onChange={() => toggle(s.slug)} />
                    {s.name}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
        {suppliers.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Supplier not listed?{" "}
            <Link href="/admin/brands?edit=new" className="font-medium text-primary hover:underline">
              Add it under Suppliers
            </Link>{" "}
            first, with its logo.
          </p>
        )}
        {/* Photos saved on older items stay until removed; new links need no upload. */}
        {saved.length > 0 && (
          <ul className="space-y-3">
            {saved.map((offer) => (
              <li key={offer.slug} className="flex flex-wrap items-center gap-3 rounded-xl border bg-background p-3">
                <span className="w-28 shrink-0 text-sm font-medium">{suppliers.find((s) => s.slug === offer.slug)?.name ?? offer.slug}</span>
                <Image src={offer.image.src} alt="" width={80} height={60} className="h-14 w-auto rounded-md border bg-white object-contain p-1" />
                <Button type="button" size="xs" variant="outline" onClick={() => clearPhoto(offer.slug)}>
                  Remove photo
                </Button>
              </li>
            ))}
          </ul>
        )}
      </FormCard>

      <SaveBar error={state?.error}>
        <Button variant="brand" disabled={pending || categories.length === 0}>
          {pending ? "Saving…" : item ? "Save changes" : "Create item"}
        </Button>
      </SaveBar>
    </form>
  );
}
