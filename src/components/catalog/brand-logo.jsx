import Image from "next/image";
import { cn } from "@/lib/utils";

// Logos come from the catalogue on white backgrounds, so they sit on a white tile.
export function BrandLogo({ brand, className, sizes = "160px" }) {
  return (
    <div className={cn("relative grid place-items-center rounded-lg bg-white px-5 py-4", className)}>
      {brand.logoImage ? (
        <Image
          src={brand.logoImage.src}
          alt={brand.logoImage.alt}
          width={brand.logoImage.width}
          height={brand.logoImage.height}
          sizes={sizes}
          className="h-full max-h-12 w-auto object-contain"
        />
      ) : (
        <span className="text-2xl font-bold tracking-tight text-slate-900">{brand.name}</span>
      )}
    </div>
  );
}
