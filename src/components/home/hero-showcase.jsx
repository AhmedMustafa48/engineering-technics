"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

// Desktop layout: overlapping tiles at different depths (larger depth = moves more).
const LAYOUT = [
  { className: "left-0 top-[4%] h-[56%] w-[54%] z-10", depth: 0.6, delay: "0.15s", float: "0s" },
  { className: "right-0 top-0 h-[42%] w-[40%] z-20", depth: 1, delay: "0.3s", float: "-1.5s" },
  { className: "right-[3%] bottom-0 h-[50%] w-[44%] z-30", depth: 1.4, delay: "0.45s", float: "-3s" },
  { className: "left-[4%] bottom-0 h-[36%] w-[40%] z-20", depth: 0.9, delay: "0.6s", float: "-4.5s" },
];

function Tile({ product, layout, springX, springY, priority }) {
  const x = useTransform(springX, (v) => v * 36 * layout.depth);
  const y = useTransform(springY, (v) => v * 36 * layout.depth);
  const image = product.image;

  return (
    <div className={cn("animate-rise absolute", layout.className)} style={{ animationDelay: layout.delay }}>
      <div className="animate-float h-full" style={{ animationDelay: layout.float }}>
        <motion.div style={{ x, y }} className="h-full">
          <Link
            href={`/products/${product.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-2 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/10 transition-transform duration-300 hover:scale-[1.03]"
          >
            <div className="relative flex-1">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={priority}
                sizes="(min-width: 1024px) 320px, 45vw"
                placeholder="blur"
                blurDataURL={image.blurDataURL}
                className="object-contain p-2"
              />
            </div>
            <div className="flex items-center gap-2 border-t border-slate-100 px-2 pt-2 pb-1">
              <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">{product.brand}</span>
              <span className="truncate text-xs font-medium text-slate-700">{product.name}</span>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export function HeroShowcase({ products }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 60, damping: 18 });
  const springY = useSpring(my, { stiffness: 60, damping: 18 });

  function onPointerMove(e) {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  return (
    <>
      {/* Desktop: layered, floating, pointer parallax */}
      <div
        className="relative hidden aspect-[1/0.95] w-full lg:block"
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        {products.slice(0, LAYOUT.length).map((p, i) => (
          <Tile key={p.slug} product={p} layout={LAYOUT[i]} springX={springX} springY={springY} priority={i < 2} />
        ))}
      </div>

      {/* Mobile/tablet: a simple 2×2 grid */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        {products.slice(0, 4).map((p, i) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="animate-rise flex flex-col overflow-hidden rounded-xl bg-white p-2 shadow-xl"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            <div className="relative aspect-square">
              <Image src={p.image.src} alt={p.image.alt} fill sizes="45vw" className="object-contain p-1" />
            </div>
            <span className="mt-1 truncate px-1 text-xs font-medium text-slate-700">{p.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
