"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ImagePlaceholder } from "@/components/catalog/product-card";
import { cn } from "@/lib/utils";

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 } };

// onDark: thumbnail states tuned for the dark brand panel.
export function ProductGallery({ images, title, categoryIcon, onDark = false }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] overflow-hidden rounded-2xl border">
        <ImagePlaceholder product={{ category: { icon: categoryIcon } }} />
      </div>
    );
  }

  const current = images[index];
  const many = images.length > 1;
  const step = (d) => setIndex((i) => (i + d + images.length) % images.length);

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white shadow-[0_30px_60px_-25px_rgb(0_0_0/0.5)] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label={`Enlarge image: ${current.alt}`}
      >
        <AnimatePresence initial={false}>
          <motion.div key={current.key} className="absolute inset-0" {...fade}>
            <Image
              src={current.src}
              alt={current.alt}
              fill
              priority={index === 0}
              placeholder="blur"
              blurDataURL={current.blurDataURL}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-6 sm:p-10"
            />
          </motion.div>
        </AnimatePresence>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-slate-900/75 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand className="size-3.5" /> Enlarge
        </span>
      </button>

      {many && (
        <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Product images">
          {images.map((img, i) => (
            <li key={img.key} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-lg border-2 bg-white transition-all sm:size-20",
                  i === index ? (onDark ? "border-cyan-300" : "border-primary") : "border-transparent opacity-60 hover:opacity-100",
                )}
              >
                <Image src={img.src} alt="" fill sizes="80px" className="object-contain p-1.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-[calc(100%-1rem)] gap-0 overflow-hidden bg-white p-0 text-slate-900 sm:max-w-5xl"
          onKeyDown={(e) => {
            if (!many) return;
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="relative h-[75dvh]">
            <AnimatePresence initial={false}>
              <motion.div key={current.key} className="absolute inset-0" {...fade}>
                <Image src={current.src} alt={current.alt} fill sizes="90vw" className="object-contain p-6 sm:p-12" />
              </motion.div>
            </AnimatePresence>
            {many && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}
          </div>
          <p className="border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-500">
            {current.alt}
            {many && ` · ${index + 1} / ${images.length}`}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
