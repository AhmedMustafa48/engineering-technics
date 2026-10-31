import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/catalog/product-card";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { accent } from "@/lib/accents";
import { heroImages } from "@/lib/hero-photo";
import { cn } from "@/lib/utils";

const TILES = 6;

// One item per supplier first, so the tiles show the breadth of the range.
function pickItems(items) {
  const withImage = items.filter((i) => i.image);
  const seen = new Set();
  const spread = withImage.filter((i) => {
    const supplier = i.suppliers[0]?.slug;
    if (seen.has(supplier)) return false;
    seen.add(supplier);
    return true;
  });
  return [...spread, ...withImage.filter((i) => !spread.includes(i))].slice(0, TILES);
}

// The lead product as a photo card beside a grid of its parts; any further products follow as cards.
export function ProductShowcase({ products }) {
  const [lead, ...rest] = products;
  if (!lead) return null;

  return (
    <>
      <div className="mt-10 grid gap-5 lg:grid-cols-12">
        <Link
          href={`/products/${lead.slug}`}
          className="group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl p-7 text-white shadow-xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/20 lg:col-span-5"
        >
          <Image
            src={heroImages.products.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 500px, 100vw"
            style={{ objectPosition: "60% 50%" }}
            className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#07142a] via-[#07142a]/55 to-transparent" />
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Featured product</p>
          <h3 className="mt-2 text-3xl font-bold">{lead.name}</h3>
          <p className="mt-3 leading-relaxed text-white/85">{lead.summary}</p>
          <span className="mt-5 inline-flex items-center gap-2 font-semibold text-cyan-300">
            Explore all items <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Stagger as="ul" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-7">
          {pickItems(lead.items).map((item, i) => (
            <StaggerItem as="li" key={item.slug}>
              <Link
                href={`/products/${lead.slug}#item-${item.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                <span className={cn("relative block aspect-[4/3] overflow-hidden", accent(i).soft)}>
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(min-width: 1024px) 230px, 50vw"
                    className="object-contain p-3 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-1 flex-col gap-1 p-3.5">
                  <span className={cn("text-xs font-semibold uppercase tracking-wide", accent(i).text)}>{item.suppliers[0]?.name}</span>
                  <span className="line-clamp-2 text-sm font-semibold leading-snug">{item.name}</span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {rest.length > 0 && (
        <Stagger className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <StaggerItem key={p.slug}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </>
  );
}
