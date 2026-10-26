import { Check } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SpecList({ specs }) {
  return (
    <dl className="divide-y overflow-hidden rounded-xl border">
      {specs.map((s) => (
        <div key={s.label} className="grid gap-1 px-4 py-3 text-sm even:bg-muted/40 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6">
          <dt className="text-muted-foreground">{s.label}</dt>
          <dd className="font-medium">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SpecTable({ table }) {
  return (
    <figure className="overflow-hidden rounded-xl border">
      <Table className="min-w-max">
        <TableCaption className="mt-0 border-t px-4 py-3 text-left text-xs">
          {table.title}
          {table.note && ` — ${table.note}`}
        </TableCaption>
        <TableHeader className="bg-muted/60">
          <TableRow>
            {table.columns.map((c) => (
              <TableHead key={c} className="px-4 text-xs font-semibold whitespace-nowrap">
                {c}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.rows.map((row) => (
            <TableRow key={row.join("|")}>
              {row.map((cell, i) => (
                <TableCell
                  key={i}
                  className={i === 0 ? "px-4 font-medium whitespace-nowrap" : "px-4 tabular-nums text-muted-foreground"}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </figure>
  );
}

export function HighlightList({ items }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((h) => (
        <li key={h} className="flex gap-3 text-sm leading-relaxed">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-foreground">
            <Check className="size-3" />
          </span>
          {h}
        </li>
      ))}
    </ul>
  );
}

export function TagList({ items, mono = false }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li key={t} className={`rounded-md border bg-secondary px-2.5 py-1 text-xs font-medium ${mono ? "font-mono" : ""}`}>
          {t}
        </li>
      ))}
    </ul>
  );
}
