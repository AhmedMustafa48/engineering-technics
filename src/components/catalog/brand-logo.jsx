import Image from "next/image";
import { cn } from "@/lib/utils";

// Logos sit on a white tile. Height is fixed and width follows the logo's own ratio (capped to the
// tile), so wide wordmarks and square marks both stay legible.
export function BrandLogo({ brand, className, imageClassName = "h-12", sizes = "160px" }) {
  return (
    <div className={cn("relative grid place-items-center rounded-lg bg-white px-5 py-4", className)}>
      {brand.logoImage ? (
        <Image
          src={brand.logoImage.src}
          alt={brand.logoImage.alt}
          width={brand.logoImage.width}
          height={brand.logoImage.height}
          sizes={sizes}
          className={cn("w-auto max-w-full object-contain", imageClassName)}
        />
      ) : (
        <span className="text-2xl font-bold tracking-tight text-slate-900">{brand.name}</span>
      )}
    </div>
  );
}
