"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Mail } from "lucide-react";
import { CategoryIcon } from "@/components/catalog/category-icon";
import { ClampText } from "@/components/catalog/clamp-text";
import { ImagePlaceholder } from "@/components/catalog/product-card";
import { cn } from "@/lib/utils";

// One supplier's version of the item: their own photo (branding / logo printing) and who they are.
function SupplierCard({ supplier, item, productIcon }) {
  const image = supplier.image ?? item.image;
  return (
    <li className="spotlight flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        {image ? (
          <Image
            src={image.src}
            alt={supplier.image ? image.alt : `${item.name} — ${supplier.name}`}
            fill
            sizes="(min-width: 1280px) 340px, (min-width: 640px) 45vw, 100vw"
            placeholder={image.blurDataURL ? "blur" : "empty"}
            blurDataURL={image.blurDataURL}
            className="object-contain p-5"
          />
        ) : (
          <ImagePlaceholder icon={productIcon} />
        )}
      </div>
      <div className="flex items-center gap-3 border-t p-4">
        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-white ring-1 ring-border">
          {supplier.logoImage ? (
            <Image src={supplier.logoImage.src} alt="" width={40} height={40} className="size-8 object-contain" />
          ) : (
            <span className="text-xs font-bold text-slate-700">{supplier.name.slice(0, 2).toUpperCase()}</span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{supplier.name}</p>
          <Link href={`/brands/${supplier.slug}`} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4">
            About supplier <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </li>
  );
}

// The selected item: its name and description once, then a card for each supplier that provides it.
function ItemPanel({ item, productSlug, productIcon, selected }) {
  return (
    <article id={`item-${item.slug}`} hidden={!selected} className="scroll-mt-28">
      <header className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold leading-tight">{item.name}</h2>
        <ClampText text={item.description} className="mt-3" />
        <Link
          href={`/contact?item=${productSlug}/${item.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          <Mail className="size-4" /> Enquire about this item <ArrowRight className="size-4" />
        </Link>
      </header>

      <h3 className="mt-8 mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {item.suppliers.length
          ? `Available from ${item.suppliers.length} ${item.suppliers.length === 1 ? "supplier" : "suppliers"}`
          : "Supplier on request"}
      </h3>
      {item.suppliers.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {item.suppliers.map((s) => (
            <SupplierCard key={s.slug} supplier={s} item={item} productIcon={productIcon} />
          ))}
        </ul>
      )}
    </article>
  );
}

// Left: all main products; the open one lists its items (pick one).
// Right: that item, with one card per supplier. Every item is in the HTML (hidden ones stay crawlable).
export function ProductBrowser({ products, active }) {
  const items = useMemo(() => active?.items ?? [], [active]);
  const [selected, setSelected] = useState(items[0]?.slug ?? null);

  // Deep link: /products/power-transformer#item-radiators opens that item (also on in-page hash changes).
  useEffect(() => {
    const apply = () => {
      const slug = window.location.hash.replace("#item-", "");
      if (slug && items.some((i) => i.slug === slug)) setSelected(slug);
    };
    const frame = requestAnimationFrame(apply);
    window.addEventListener("hashchange", apply);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", apply);
    };
  }, [items]);

  function choose(slug) {
    setSelected(slug);
    history.replaceState(null, "", `#item-${slug}`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
      <nav aria-label="Products" className="rounded-2xl border bg-card p-2 lg:sticky lg:top-24">
        <ul className="space-y-1">
          {products.map((p) => {
            const isActive = active?.slug === p.slug;
            return (
              <li key={p.slug}>
                <Link
                  href={`/products/${p.slug}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  )}
                >
                  <CategoryIcon name={p.icon} className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  <span className={cn("text-xs tabular-nums", isActive ? "text-primary-foreground/70" : "text-muted-foreground")}>{p.itemCount}</span>
                  <ChevronDown className={cn("size-4 shrink-0 transition-transform", isActive ? "rotate-180" : "-rotate-90 opacity-50")} />
                </Link>

                {isActive && (
                  <fieldset className="mt-1 mb-2 ml-3 border-l pl-3">
                    <legend className="sr-only">Items in {p.name}</legend>
                    <p className="py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</p>
                    <ul className="max-h-[50vh] space-y-0.5 overflow-y-auto pr-1">
                      {items.map((item) => {
                        const on = selected === item.slug;
                        return (
                          <li key={item.slug}>
                            <label className={cn("flex cursor-pointer items-start gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-accent", on && "bg-accent font-medium")}>
                              <input type="radio" name="item" className="peer sr-only" checked={on} onChange={() => choose(item.slug)} />
                              <span
                                aria-hidden
                                className={cn(
                                  "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border transition-colors peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
                                  on ? "border-primary" : "border-input bg-background",
                                )}
                              >
                                {on && <span className="size-2 rounded-full bg-primary" />}
                              </span>
                              <span className="leading-snug">{item.name}</span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </fieldset>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <section aria-label={active ? `${active.name} item details` : "Item details"} aria-live="polite">
        {active && items.length === 0 && (
          <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Items for this product are coming soon.</p>
        )}
        {active && items.map((item) => <ItemPanel key={item.slug} item={item} productSlug={active.slug} productIcon={active.icon} selected={selected === item.slug} />)}
      </section>
    </div>
  );
}
