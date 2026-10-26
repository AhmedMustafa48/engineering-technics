"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SWIPE_PX = 80;
const ZOOM_STEPS = [1, 1.5, 2, 3];

function clampPage(value, total) {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, 1), total) : 1;
}

// ?page=N keeps deep links from product pages working; replaceState keeps it in sync.
function writePage(n) {
  const params = new URLSearchParams(window.location.search);
  if (n === 1) params.delete("page");
  else params.set("page", String(n));
  const qs = params.toString();
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
}

const slide = {
  enter: (dir) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir * -48 }),
};

export function CatalogueViewer({ pages }) {
  const total = pages.length;
  const searchParams = useSearchParams();
  const [page, setPage] = useState(() => clampPage(searchParams.get("page"), total));
  const [direction, setDirection] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [pageInput, setPageInput] = useState(String(page));
  const thumbRefs = useRef(new Map());

  // Adopt external URL changes (e.g. the header link back to /catalogue).
  const urlPage = clampPage(searchParams.get("page"), total);
  const [syncedPage, setSyncedPage] = useState(urlPage);
  if (urlPage !== syncedPage) {
    setSyncedPage(urlPage);
    if (urlPage !== page) {
      setPage(urlPage);
      setPageInput(String(urlPage));
    }
  }

  const current = pages[page - 1];

  function goTo(n) {
    const next = clampPage(n, total);
    if (next === page) return;
    setDirection(next > page ? 1 : -1);
    setPage(next);
    setPageInput(String(next));
    writePage(next);
  }

  // Arrow keys flip pages unless the visitor is typing in a field.
  useEffect(() => {
    function onKey(e) {
      if (zoomOpen || e.target.closest?.("input, textarea")) return;
      if (e.key === "ArrowRight") goTo(page + 1);
      if (e.key === "ArrowLeft") goTo(page - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    thumbRefs.current.get(page)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [page]);

  const thumbs = pages.map((p) => (
    <li key={p.number} className="shrink-0">
      <button
        type="button"
        ref={(el) => (el ? thumbRefs.current.set(p.number, el) : thumbRefs.current.delete(p.number))}
        onClick={() => goTo(p.number)}
        aria-label={`Page ${p.number}: ${p.label}`}
        aria-current={p.number === page ? "page" : undefined}
        className={cn(
          "group block w-16 text-left lg:w-full",
          p.number === page ? "opacity-100" : "opacity-60 hover:opacity-100",
        )}
      >
        <span
          className={cn(
            "relative block aspect-[1/1.414] overflow-hidden rounded-md border-2 bg-white transition-colors",
            p.number === page ? "border-primary" : "border-transparent",
          )}
        >
          <Image src={p.src} alt="" fill sizes="96px" className="object-cover" />
        </span>
        <span className="mt-1 hidden truncate text-[11px] text-muted-foreground lg:block">
          {p.number}. {p.label}
        </span>
      </button>
    </li>
  ));

  return (
    <div className="grid gap-6 lg:grid-cols-[112px_minmax(0,1fr)_260px] lg:gap-8">
      {/* Thumbnails: vertical rail on desktop, horizontal strip on mobile */}
      <nav aria-label="Catalogue pages" className="order-3 lg:order-1">
        <ul className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:flex-col lg:gap-3 lg:overflow-y-auto lg:overflow-x-visible lg:pr-1">
          {thumbs}
        </ul>
      </nav>

      <div className="order-1 min-w-0 lg:order-2">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page">
              <ChevronLeft />
            </Button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goTo(pageInput);
              }}
              className="flex items-center gap-1.5 px-2 text-sm"
            >
              <label htmlFor="page-input" className="sr-only">
                Page number
              </label>
              <input
                id="page-input"
                inputMode="numeric"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ""))}
                onBlur={() => setPageInput(String(page))}
                className="h-9 w-11 rounded-md border bg-transparent text-center tabular-nums outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              />
              <span className="text-muted-foreground">of {total}</span>
            </form>
            <Button variant="outline" size="icon" onClick={() => goTo(page + 1)} disabled={page === total} aria-label="Next page">
              <ChevronRight />
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setZoomOpen(true)}>
            <Maximize2 /> Zoom
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-2xl border bg-muted/50 p-2 sm:p-4">
          <div className="relative mx-auto aspect-[1/1.414] max-w-3xl">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={current.number}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -SWIPE_PX) goTo(page + 1);
                  else if (info.offset.x > SWIPE_PX) goTo(page - 1);
                }}
                className="absolute inset-0 cursor-grab touch-pan-y overflow-hidden rounded-md bg-white shadow-lg active:cursor-grabbing"
              >
                <Image
                  src={current.src}
                  alt={`Catalogue page ${current.number}: ${current.label}`}
                  fill
                  priority
                  draggable={false}
                  placeholder="blur"
                  blurDataURL={current.blurDataURL}
                  sizes="(min-width: 1024px) 768px, 100vw"
                  className="pointer-events-none object-contain select-none"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Warm the cache for neighbouring pages so flipping feels instant. */}
          <div aria-hidden className="pointer-events-none absolute size-px overflow-hidden opacity-0">
            {[pages[page - 2], pages[page]].filter(Boolean).map((p) => (
              <Image key={p.number} src={p.src} alt="" width={p.width} height={p.height} loading="eager" sizes="(min-width: 1024px) 768px, 100vw" />
            ))}
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Swipe, use the arrow keys, or pick a page from the thumbnails.
        </p>
      </div>

      {/* What's on this page → product pages */}
      <aside aria-labelledby="on-this-page" className="order-2 lg:order-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-foreground">
            Page {current.number}
          </p>
          <h2 id="on-this-page" className="mt-1 font-semibold">
            {current.label}
          </h2>
          {current.products.length > 0 ? (
            <ul className="mt-4 space-y-1">
              {current.products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="group flex items-start justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  >
                    <span>{p.name}</span>
                    <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              {current.number === 1 ? "Flip forward to explore the product range." : "Get in touch for quotations and lead times."}
            </p>
          )}
          <Button asChild variant="outline" size="sm" className="mt-5 w-full">
            <Link href={current.brandSlug ? `/contact?brand=${current.brandSlug}` : "/contact"}>Enquire about this page</Link>
          </Button>
        </div>
      </aside>

      <Dialog
        open={zoomOpen}
        onOpenChange={(open) => {
          setZoomOpen(open);
          if (!open) setZoom(0);
        }}
      >
        <DialogContent className="flex h-[92dvh] max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-2.5 pr-12">
            <DialogTitle className="truncate text-sm">
              Page {current.number} · {current.label}
            </DialogTitle>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" onClick={() => setZoom((z) => Math.max(z - 1, 0))} disabled={zoom === 0} aria-label="Zoom out">
                <Minus />
              </Button>
              <span className="w-12 text-center text-xs tabular-nums">{ZOOM_STEPS[zoom] * 100}%</span>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setZoom((z) => Math.min(z + 1, ZOOM_STEPS.length - 1))}
                disabled={zoom === ZOOM_STEPS.length - 1}
                aria-label="Zoom in"
              >
                <Plus />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-muted/60 p-4">
            {/* Full-resolution render; width scales with the zoom step. */}
            <Image
              src={current.src}
              alt={`Catalogue page ${current.number}: ${current.label}`}
              width={current.width}
              height={current.height}
              unoptimized
              style={{ width: `${ZOOM_STEPS[zoom] * 100}%`, maxWidth: "none" }}
              className="mx-auto h-auto bg-white shadow-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
