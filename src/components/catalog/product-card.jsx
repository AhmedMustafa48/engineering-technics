import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CategoryIcon } from "@/components/catalog/category-icon";
import { cn } from "@/lib/utils";

// Shown when the catalogue has no photo: branded, on-grid, clearly intentional.
export function ImagePlaceholder({ product, className }) {
  return (
    <div className={cn("relative grid h-full place-items-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100", className)}>
      <div aria-hidden className="bg-grid absolute inset-0 [--grid-line:rgb(15_23_42/0.06)] [--grid-size:24px]" />
      <div className="relative flex flex-col items-center gap-3 text-slate-400">
        <span className="grid size-14 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <CategoryIcon name={product.category.icon} className="size-7 text-slate-500" />
        </span>
        <span className="text-xs font-medium">Image on request</span>
      </div>
    </div>
  );
}

export function ProductCard({ product, className, priority = false }) {
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "spotlight group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      {/* Product photos are shot on white, so the frame stays white in both themes. */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            placeholder="blur"
            blurDataURL={image.blurDataURL}
            priority={priority}
            className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <ImagePlaceholder product={product} />
        )}
        <span className="absolute left-3 top-3 rounded-md bg-slate-900/85 px-2 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur">
          {product.brand.name}
        </span>
        <span className="absolute right-3 top-3 grid size-8 -rotate-45 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:rotate-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="relative z-[3] flex flex-1 flex-col gap-2 border-t bg-card p-5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-brand-foreground">
          <CategoryIcon name={product.category.icon} className="size-3.5" />
          {product.category.name}
        </p>
        <h3 className="font-semibold leading-snug transition-colors group-hover:text-primary">{product.name}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.summary}</p>
      </div>
    </Link>
  );
}
