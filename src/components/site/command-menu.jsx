"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Building2, Mail, Package, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { CategoryIcon } from "@/components/catalog/category-icon";
import { cn } from "@/lib/utils";

const pages = [
  { href: "/products", label: "All products", icon: Package },
  { href: "/brands", label: "Suppliers", icon: Building2 },
  { href: "/catalogue", label: "Catalogue", icon: BookOpen },
  { href: "/contact", label: "Contact & enquiries", icon: Mail },
];

// Site-wide quick search: ⌘K / Ctrl+K or "/" opens it from anywhere.
export function CommandMenu({ data, className }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function onKey(e) {
      const typing = e.target.closest?.("input, textarea, [contenteditable=true]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function go(href) {
    setOpen(false);
    router.push(href);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group inline-flex h-9 items-center gap-2 rounded-lg border bg-background/60 px-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground",
          className,
        )}
        aria-label="Search products"
      >
        <Search className="size-4" />
        <span className="hidden xl:inline">Search products…</span>
        <kbd className="hidden rounded border bg-muted px-1.5 font-mono text-[10px] font-medium xl:inline">⌘K</kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search products, items and suppliers"
      >
        <CommandInput placeholder="Search products, items, suppliers…" />
        <CommandList className="max-h-[min(60dvh,420px)]">
          <CommandEmpty>
            <p>No matches.</p>
            <button type="button" onClick={() => go("/contact")} className="mt-2 text-sm font-medium text-primary hover:underline">
              Ask us about it →
            </button>
          </CommandEmpty>

          <CommandGroup heading="Products">
            {data.products.map((p) => (
              <CommandItem key={p.slug} value={`${p.name} ${p.slug}`} onSelect={() => go(`/products/${p.slug}`)}>
                <CategoryIcon name={p.icon} className="text-muted-foreground" />
                {p.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Items">
            {data.items.map((i) => (
              <CommandItem key={i.key} value={`${i.name} ${i.product}`} keywords={i.suppliers} onSelect={() => go(`/products/${i.productSlug}#item-${i.itemSlug}`)}>
                <Package className="text-muted-foreground" />
                <span className="flex-1 truncate">{i.name}</span>
                <span className="truncate text-xs text-muted-foreground">{i.suppliers.join(", ")}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Suppliers">
            {data.brands.map((b) => (
              <CommandItem key={b.slug} value={`brand ${b.name} ${b.fullName}`} onSelect={() => go(`/brands/${b.slug}`)}>
                <Building2 className="text-muted-foreground" />
                <span className="flex-1">{b.name}</span>
                {b.fullName !== b.name && <span className="truncate text-xs text-muted-foreground">{b.fullName}</span>}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Pages">
            {pages.map(({ href, label, icon: Icon }) => (
              <CommandItem key={href} value={`page ${label}`} onSelect={() => go(href)}>
                <Icon className="text-muted-foreground" />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
