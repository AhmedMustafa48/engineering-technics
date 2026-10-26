import { ProductCard } from "@/components/catalog/product-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export const productGridClass = "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3";

// Server-rendered grid with a scroll-triggered stagger; used by category/brand pages
// and as the prerendered fallback for the interactive explorer.
export function ProductGrid({ products, className, animate = true }) {
  if (!animate) {
    return (
      <ul className={cn(productGridClass, className)}>
        {products.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <Stagger as="ul" className={cn(productGridClass, className)} stagger={0.05}>
      {products.map((p) => (
        <StaggerItem as="li" key={p.slug}>
          <ProductCard product={p} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
