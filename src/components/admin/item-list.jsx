import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { moveItem } from "@/app/admin/actions";
import { accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

function MoveButton({ id, direction, disabled }) {
  const Icon = direction === "up" ? ArrowUp : ArrowDown;
  return (
    <form action={moveItem}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      <Button variant="outline" size="icon-xs" disabled={disabled} aria-label={`Move ${direction}`}>
        <Icon />
      </Button>
    </form>
  );
}

// items: [{ id, name, image, category: { id, name, index }, suppliers: [name] }]
// `sortable` adds the up/down controls, which only make sense inside one category.
export function ItemList({ items, sortable = false }) {
  if (items.length === 0) {
    return <p className="rounded-2xl border bg-card p-8 text-center text-sm text-muted-foreground">No items found.</p>;
  }
  return (
    <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-sm">
      {items.map((item, n) => (
        <li key={item.id} className="flex items-center gap-2 pr-3 transition-colors hover:bg-muted/50">
          <Link href={`/admin/items/${item.id}`} className="flex min-w-0 flex-1 items-center gap-4 p-3">
            <span className={cn("relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg", accent(item.category.index).soft)}>
              {item.image ? (
                <Image src={item.image.src} alt="" fill sizes="56px" className="object-contain p-1 mix-blend-multiply" />
              ) : (
                <Package aria-hidden className="size-5 text-slate-500" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{item.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {item.suppliers.length ? item.suppliers.join(", ") : "No suppliers yet"}
              </span>
            </span>
            <Badge variant="outline" className={cn("hidden max-w-48 truncate sm:inline-flex", accent(item.category.index).text)}>
              {item.category.name}
            </Badge>
          </Link>
          {sortable && (
            <span className="flex shrink-0 gap-1">
              <MoveButton id={item.id} direction="up" disabled={n === 0} />
              <MoveButton id={item.id} direction="down" disabled={n === items.length - 1} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
