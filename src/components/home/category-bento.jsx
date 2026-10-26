import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { CategoryIcon } from "@/components/catalog/category-icon";
import { cn } from "@/lib/utils";

// First category gets a 2×2 feature tile (unless featureFirst is false); the rest fill a 4-column grid.
export function CategoryBento({ categories, featureFirst = true }) {
  return (
    <Stagger className="grid auto-rows-[15rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.04}>
      {categories.map((c, i) => {
        const feature = featureFirst && i === 0;
        return (
          <StaggerItem key={c.slug} className={cn(feature && "sm:col-span-2 lg:row-span-2")}>
            <Link
              href={`/categories/${c.slug}`}
              className="spotlight group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative flex-1 overflow-hidden bg-white">
                {c.coverImage ? (
                  <Image
                    src={c.coverImage.src}
                    alt=""
                    fill
                    sizes={feature ? "(min-width: 1024px) 600px, 100vw" : "(min-width: 1024px) 300px, 50vw"}
                    className={cn(
                      "object-contain transition-transform duration-700 ease-out group-hover:scale-[1.06]",
                      feature ? "p-5 lg:p-10" : "p-5",
                    )}
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-muted">
                    <CategoryIcon name={c.icon} className="size-10 text-muted-foreground/50" />
                  </div>
                )}
                <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-slate-900/80 text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 group-hover:rotate-0 -rotate-45">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <div className={cn("relative z-[3] flex items-start gap-3 border-t bg-card", feature ? "p-4 lg:p-6" : "p-4")}>
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-foreground">
                  <CategoryIcon name={c.icon} className="size-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={cn("font-semibold leading-tight", feature && "text-lg")}>{c.name}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{c.productCount}</span>
                  </span>
                  {feature && <span className="mt-1.5 line-clamp-2 hidden text-sm text-muted-foreground lg:block">{c.description}</span>}
                </span>
              </div>
            </Link>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
