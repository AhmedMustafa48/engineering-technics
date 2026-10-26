"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/catalog/product-card";
import { productGridClass } from "@/components/catalog/product-grid";
import { CategoryIcon } from "@/components/catalog/category-icon";
import { matchesQuery } from "@/lib/search";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1];

// Filter state lives in the URL (?q=&category=&brand=) so every view is shareable.
// history.replaceState keeps useSearchParams in sync without a server round trip.
function writeParams(next) {
  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of Object.entries(next)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const qs = params.toString();
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
}

function FacetList({ title, options, active, onSelect }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</legend>
      <ul className="space-y-0.5">
        {options.map((o) => {
          const selected = active === o.slug;
          const disabled = !selected && o.count === 0;
          return (
            <li key={o.slug}>
              <button
                type="button"
                onClick={() => onSelect(selected ? "" : o.slug)}
                disabled={disabled}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40",
                  selected && "bg-primary/10 font-medium text-primary hover:bg-primary/15",
                )}
              >
                {o.icon && <CategoryIcon name={o.icon} className="size-4 shrink-0 opacity-70" />}
                <span className="flex-1 truncate">{o.name}</span>
                {selected ? (
                  <Check className="size-4 shrink-0" />
                ) : (
                  <span className="text-xs tabular-nums text-muted-foreground">{o.count}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

export function ProductExplorer({ products, categories, brands }) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const brand = searchParams.get("brand") ?? "";

  // Local input state keeps typing responsive; the URL is updated after a pause.
  const [query, setQuery] = useState(q);
  const [sheetOpen, setSheetOpen] = useState(false);

  // If the URL changes from outside (e.g. a nav link to /products), adopt it.
  // Compare trimmed so our own debounced write doesn't eat a trailing space mid-typing.
  const [syncedQ, setSyncedQ] = useState(q);
  if (q !== syncedQ) {
    setSyncedQ(q);
    if (q !== query.trim()) setQuery(q);
  }

  useEffect(() => {
    if (query.trim() === q) return;
    const t = setTimeout(() => writeParams({ q: query.trim() }), 200);
    return () => clearTimeout(t);
  }, [query, q]);

  const setCategory = (slug) => writeParams({ category: slug });
  const setBrand = (slug) => writeParams({ brand: slug });
  function clearAll() {
    setQuery("");
    writeParams({ q: "", category: "", brand: "" });
  }

  const byQuery = useMemo(() => (q ? products.filter((p) => matchesQuery(p.haystack, q)) : products), [products, q]);

  const results = byQuery.filter(
    (p) => (!category || p.category.slug === category) && (!brand || p.brand.slug === brand),
  );

  // Facet counts reflect the other active filters, so zero-result options are visible but disabled.
  const categoryOptions = categories.map((c) => ({
    ...c,
    count: byQuery.filter((p) => p.category.slug === c.slug && (!brand || p.brand.slug === brand)).length,
  }));
  const brandOptions = brands.map((b) => ({
    ...b,
    count: byQuery.filter((p) => p.brand.slug === b.slug && (!category || p.category.slug === category)).length,
  }));

  const activeCategory = categories.find((c) => c.slug === category);
  const activeBrand = brands.find((b) => b.slug === brand);
  const hasFilters = Boolean(q || category || brand);

  const facets = (
    <div className="space-y-8">
      <FacetList title="Category" options={categoryOptions} active={category} onSelect={setCategory} />
      <FacetList title="Brand" options={brandOptions} active={brand} onSelect={setBrand} />
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside aria-label="Product filters" className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2 pb-6">{facets}</div>
      </aside>

      <div className="min-w-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, models or specs…"
              aria-label="Search products"
              className="h-11 pl-9 text-base"
            />
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-11 lg:hidden">
                <SlidersHorizontal /> Filters
                {(category || brand) && (
                  <span className="grid size-5 place-items-center rounded-full bg-primary text-[11px] text-primary-foreground">
                    {Number(Boolean(category)) + Number(Boolean(brand))}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-sm gap-0">
              <SheetHeader className="border-b">
                <SheetTitle>Filter products</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-4">{facets}</div>
              <SheetFooter className="flex-row border-t">
                <Button variant="ghost" onClick={clearAll} disabled={!hasFilters}>
                  Clear
                </Button>
                <Button className="flex-1" onClick={() => setSheetOpen(false)}>
                  Show {results.length} {results.length === 1 ? "product" : "products"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>

        {/* One-tap category chips on small screens, where the facet list lives in a sheet. */}
        <div className="-mx-4 mt-4 overflow-x-auto px-4 lg:hidden [scrollbar-width:none]">
          <ul className="flex w-max gap-2">
            {[{ slug: "", name: "All", count: byQuery.length }, ...categoryOptions.filter((c) => c.count > 0)].map((c) => {
              const selected = category === c.slug;
              return (
                <li key={c.slug || "all"}>
                  <button
                    type="button"
                    onClick={() => setCategory(c.slug)}
                    aria-pressed={selected}
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
                      selected ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent",
                    )}
                  >
                    {c.icon && <CategoryIcon name={c.icon} className="size-3.5" />}
                    {c.name}
                    <span className={cn("text-xs tabular-nums", selected ? "opacity-80" : "text-muted-foreground")}>{c.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-4 flex min-h-8 flex-wrap items-center gap-2 text-sm">
          <p aria-live="polite" className="mr-2 text-muted-foreground">
            <span className="font-medium text-foreground tabular-nums">{results.length}</span>{" "}
            {results.length === 1 ? "product" : "products"}
          </p>
          <AnimatePresence initial={false}>
            {[
              q && { key: "q", label: `“${q}”`, clear: () => setQuery("") },
              activeCategory && { key: "c", label: activeCategory.name, clear: () => setCategory("") },
              activeBrand && { key: "b", label: activeBrand.name, clear: () => setBrand("") },
            ]
              .filter(Boolean)
              .map((chip) => (
                <motion.button
                  key={chip.key}
                  type="button"
                  onClick={chip.clear}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1 rounded-full border bg-secondary py-1 pl-3 pr-2 text-xs font-medium hover:bg-accent"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  {chip.label} <X className="size-3.5" />
                </motion.button>
              ))}
          </AnimatePresence>
          {hasFilters && (
            <button type="button" onClick={clearAll} className="text-xs font-medium text-primary hover:underline">
              Clear all
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <motion.ul layout className={cn(productGridClass, "mt-6")}>
            <AnimatePresence initial={false} mode="popLayout">
              {results.map((p) => (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease }}
                >
                  <ProductCard product={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center"
          >
            <Search className="size-8 text-muted-foreground/60" />
            <h2 className="mt-4 text-lg font-semibold">No products match your search</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Can&apos;t find what you need? Tell us the part or specification and we&apos;ll check with our manufacturers.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={clearAll}>
                Clear filters
              </Button>
              <Button asChild>
                <Link href="/contact">Ask us</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
