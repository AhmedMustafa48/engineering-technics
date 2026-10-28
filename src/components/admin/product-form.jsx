"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveProduct } from "@/app/admin/actions";

const ICONS = ["Zap", "ShieldCheck", "Gauge", "SlidersHorizontal", "Thermometer", "Fan", "Droplets", "Layers", "Cylinder", "Cable", "CircuitBoard", "Activity", "Anchor", "Package"];
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const select = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm";

function Field({ label, hint, children, htmlFor }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Card({ title, hint, children }) {
  return (
    <section className="space-y-4 rounded-xl border bg-card p-5">
      <div>
        <h2 className="font-semibold">{title}</h2>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

export function ProductForm({ product, items: initialItems = [], suppliers }) {
  const [state, action, pending] = useActionState(saveProduct, null);
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [items, setItems] = useState(() =>
    initialItems.map((i, n) => ({ ...i, cid: i.id ?? `init-${n}`, slugTouched: true, suppliers: i.suppliers ?? [] })),
  );

  const patch = (cid, p) => setItems((list) => list.map((i) => (i.cid === cid ? { ...i, ...p } : i)));
  const move = (index, d) =>
    setItems((list) => {
      const next = [...list];
      [next[index], next[index + d]] = [next[index + d], next[index]];
      return next;
    });
  const addItem = () =>
    setItems((l) => [...l, { cid: crypto.randomUUID(), name: "", slug: "", slugTouched: false, description: "", image: null, suppliers: [] }]);
  // item.suppliers = [{ slug, image }]: each supplier offers the item with its own photo.
  const toggleSupplier = (cid, slug) =>
    setItems((list) =>
      list.map((i) =>
        i.cid === cid
          ? { ...i, suppliers: i.suppliers.some((x) => x.slug === slug) ? i.suppliers.filter((x) => x.slug !== slug) : [...i.suppliers, { slug, image: null }] }
          : i,
      ),
    );
  const patchSupplier = (cid, slug, p) =>
    setItems((list) => list.map((i) => (i.cid === cid ? { ...i, suppliers: i.suppliers.map((x) => (x.slug === slug ? { ...x, ...p } : x)) } : i)));

  const payload = items.map(({ id, name, slug, description, image, suppliers }) => ({ id, name, slug, description, image, suppliers }));

  return (
    <form action={action} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="existing_image" value={JSON.stringify(product?.image ?? null)} />
      <input type="hidden" name="items" value={JSON.stringify(payload)} />

      <Card title="Main product" hint="e.g. Power Transformer. It appears in the left list on the website.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product name" htmlFor="name">
            <Input
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </Field>
          <Field label="URL slug" htmlFor="slug" hint={`Page address: /products/${slug || "…"}`}>
            <Input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
          </Field>
          <Field label="Icon" htmlFor="icon">
            <select id="icon" name="icon" defaultValue={product?.icon ?? "Package"} className={select}>
              {ICONS.map((i) => <option key={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Cover image (optional)" htmlFor="image_file" hint="Leave empty to use the first item's image.">
            {product?.image && <Image src={product.image.src} alt="" width={96} height={72} className="mb-2 h-16 w-auto rounded border bg-white object-contain p-1" />}
            <Input id="image_file" name="image_file" type="file" accept="image/*" />
          </Field>
        </div>
        <Field label="Short summary" htmlFor="summary" hint="Shown on cards and used as the default meta description.">
          <Textarea id="summary" name="summary" rows={2} defaultValue={product?.summary} />
        </Field>
        <Field label="Description" htmlFor="description">
          <Textarea id="description" name="description" rows={4} defaultValue={product?.description} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={product ? product.published : true} /> Published (visible on the site)
        </label>
      </Card>

      <Card title={`Items (${items.length})`} hint="The parts of this product, e.g. Radiators, Cooling fans. Each item lists the suppliers that provide it.">
        {items.map((item, index) => (
          <div key={item.cid} className="space-y-4 rounded-lg border bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Item {index + 1}</p>
              <div className="flex gap-1">
                <Button type="button" size="icon-xs" variant="outline" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Move up"><ArrowUp /></Button>
                <Button type="button" size="icon-xs" variant="outline" disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label="Move down"><ArrowDown /></Button>
                <Button type="button" size="icon-xs" variant="outline" onClick={() => setItems((l) => l.filter((i) => i.cid !== item.cid))} aria-label="Remove item"><Trash2 /></Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Item name" htmlFor={`n-${item.cid}`}>
                <Input
                  id={`n-${item.cid}`}
                  value={item.name}
                  onChange={(e) => patch(item.cid, { name: e.target.value, ...(item.slugTouched ? {} : { slug: slugify(e.target.value) }) })}
                />
              </Field>
              <Field label="Item slug" htmlFor={`s-${item.cid}`}>
                <Input id={`s-${item.cid}`} value={item.slug} onChange={(e) => patch(item.cid, { slug: e.target.value, slugTouched: true })} />
              </Field>
            </div>
            <Field label="Description" htmlFor={`d-${item.cid}`} hint="Long text is collapsed on the site with a “Show more” button.">
              <Textarea id={`d-${item.cid}`} rows={4} value={item.description} onChange={(e) => patch(item.cid, { description: e.target.value })} />
            </Field>
            <Field label="Default image (optional)" htmlFor={`i-${item.cid}`} hint="Only used when a supplier below has no photo of its own.">
              {item.image && (
                <div className="mb-2 flex items-center gap-3">
                  <Image src={item.image.src} alt="" width={96} height={72} className="h-16 w-auto rounded border bg-white object-contain p-1" />
                  <Button type="button" size="xs" variant="outline" onClick={() => patch(item.cid, { image: null })}>Remove image</Button>
                </div>
              )}
              <Input id={`i-${item.cid}`} name={`item_image_${index}`} type="file" accept="image/*" />
            </Field>
            <fieldset>
              <legend className="mb-1 text-sm font-medium">Suppliers / makers</legend>
              <p className="mb-2 text-xs text-muted-foreground">Tick every supplier that offers this item, then upload that supplier&apos;s own photo (with their branding / logo).</p>
              {suppliers.length === 0 ? (
                <p className="text-xs text-muted-foreground">Add suppliers first under “Suppliers”.</p>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {suppliers.map((s) => {
                    const on = item.suppliers.some((x) => x.slug === s.slug);
                    return (
                      <li key={s.slug}>
                        <label className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-xs ${on ? "border-primary bg-primary/10 font-medium" : ""}`}>
                          <input type="checkbox" className="size-3.5" checked={on} onChange={() => toggleSupplier(item.cid, s.slug)} />
                          {s.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
              {item.suppliers.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {item.suppliers.map((offer) => {
                    const meta = suppliers.find((s) => s.slug === offer.slug);
                    return (
                      <li key={offer.slug} className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
                        <span className="w-32 shrink-0 text-sm font-medium">{meta?.name ?? offer.slug}</span>
                        {offer.image ? (
                          <>
                            <Image src={offer.image.src} alt="" width={80} height={60} className="h-14 w-auto rounded border bg-white object-contain p-1" />
                            <Button type="button" size="xs" variant="outline" onClick={() => patchSupplier(item.cid, offer.slug, { image: null })}>Remove photo</Button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">No photo yet</span>
                        )}
                        <Input
                          name={`offer_image_${index}_${offer.slug}`}
                          type="file"
                          accept="image/*"
                          aria-label={`${meta?.name ?? offer.slug} photo`}
                          className="min-w-0 flex-1 basis-56"
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </fieldset>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus /> Add item
        </Button>
      </Card>

      <Card title="SEO (optional)">
        <Field label="Meta title" htmlFor="seo_title" hint="Leave blank for an automatic title. Keep under ~60 characters.">
          <Input id="seo_title" name="seo_title" defaultValue={product?.seo_title ?? ""} maxLength={70} />
        </Field>
        <Field label="Meta description" htmlFor="seo_description" hint="Leave blank to use the summary. Keep under ~160 characters.">
          <Textarea id="seo_description" name="seo_description" rows={2} defaultValue={product?.seo_description ?? ""} maxLength={180} />
        </Field>
      </Card>

      {state?.error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{state.error}</p>}
      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t bg-background/90 px-4 py-3 backdrop-blur">
        <Button disabled={pending}>{pending ? "Saving…" : product ? "Save changes" : "Create product"}</Button>
      </div>
    </form>
  );
}
