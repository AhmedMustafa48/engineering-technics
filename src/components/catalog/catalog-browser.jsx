"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import { CategoryIcon } from "@/components/catalog/category-icon";
import { ImagePlaceholder } from "@/components/catalog/product-card";
import { accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

const ALL = "all";

// For a shortened list: photographed items first, one per supplier, so it shows the breadth of the range.
function pickVaried(items, count) {
  const ranked = [...items.filter((i) => i.image), ...items.filter((i) => !i.image)];
  const seen = new Set();
  const spread = ranked.filter((i) => {
    if (seen.has(i.supplier)) return false;
    seen.add(i.supplier);
    return true;
  });
  return [...spread, ...ranked.filter((i) => !spread.includes(i))].slice(0, count);
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-colors lg:whitespace-normal",
        active ? "bg-brand text-[#0b1628]" : "hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}

function ItemCard({ item, index }) {
  const { text } = accent(index);
  return (
    <Link
      href={item.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <span className="relative block aspect-[4/3] overflow-hidden bg-white">
        {item.image ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder icon={item.icon} />
        )}
        <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-1 p-4">
        {item.supplier && <span className={cn("text-xs font-semibold uppercase tracking-wide", text)}>{item.supplier}</span>}
        <span className="line-clamp-2 font-semibold leading-snug">{item.name}</span>
      </span>
    </Link>
  );
}

// Left: category filter. Right: the products in that category, each opening its detail page.
// `limit` shortens the list for the landing page.
export function CatalogBrowser({ categories, limit }) {
  const [selected, setSelected] = useState(ALL);
  const current = categories.find((c) => c.slug === selected);
  const items = current ? current.items : categories.flatMap((c) => c.items);
  const shown = limit ? pickVaried(items, limit) : items;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-8">
      <nav aria-label="Filter by category" className="rounded-2xl border bg-card p-2 shadow-sm lg:sticky lg:top-24">
        <p className="hidden px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:block">Categories</p>
        <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          <li className="shrink-0">
            <FilterButton active={selected === ALL} onClick={() => setSelected(ALL)}>
              <LayoutGrid aria-hidden className="size-4 shrink-0" /> All products
            </FilterButton>
          </li>
          {categories.map((c) => (
            <li key={c.slug} className="shrink-0">
              <FilterButton active={selected === c.slug} onClick={() => setSelected(c.slug)}>
                <CategoryIcon name={c.icon} className="size-4 shrink-0" /> {c.name}
              </FilterButton>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-label={current ? `${current.name} products` : "All products"} aria-live="polite">
        {shown.length === 0 ? (
          <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">Products in this category are coming soon.</p>
        ) : (
          <ul key={selected} className="animate-rise grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {shown.map((item, i) => (
              <li key={item.href}>
                <ItemCard item={item} index={i} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
