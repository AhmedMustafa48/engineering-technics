"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Minimize2, Minus, PanelLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ZOOMS = [0.6, 0.8, 1, 1.25, 1.5, 2, 3];
const DEFAULT_ZOOM = 2;
const PAGE_GAP = 16;

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

// PDF-reader style viewer: every page stacked in one scrollable pane, with a toolbar for page
// jumping, zoom and fullscreen, and a thumbnail rail for orientation.
export function CatalogueViewer({ pages }) {
  const total = pages.length;
  const searchParams = useSearchParams();
  const [initialPage] = useState(() => clampPage(searchParams.get("page"), total));
  const [page, setPage] = useState(initialPage);
  const [pageInput, setPageInput] = useState(String(initialPage));
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [showThumbs, setShowThumbs] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const rootRef = useRef(null);
  const paneRef = useRef(null);
  const railRef = useRef(null);
  const pageEls = useRef(new Map());
  const thumbEls = useRef(new Map());
  const pageNow = useRef(initialPage);
  const lockUntil = useRef(0); // ignore scroll-driven page updates while we scroll programmatically

  const current = pages[page - 1];
  const factor = ZOOMS[zoom];

  function scrollToPage(n, smooth) {
    const el = pageEls.current.get(n);
    if (!el || !paneRef.current) return;
    lockUntil.current = Date.now() + (smooth ? 800 : 150);
    paneRef.current.scrollTo({ top: el.offsetTop - PAGE_GAP, behavior: smooth ? "smooth" : "auto" });
  }

  function commitPage(n) {
    pageNow.current = n;
    setPage(n);
    setPageInput(String(n));
    writePage(n);
  }

  function goTo(value) {
    const next = clampPage(value, total);
    commitPage(next);
    scrollToPage(next, true);
  }

  // Track which page is in view while the visitor scrolls.
  function onScroll() {
    if (Date.now() < lockUntil.current) return;
    const pane = paneRef.current;
    const probe = pane.scrollTop + pane.clientHeight * 0.35;
    let found = 1;
    for (const p of pages) {
      const el = pageEls.current.get(p.number);
      if (el && el.offsetTop <= probe) found = p.number;
    }
    if (found !== pageNow.current) commitPage(found);
  }

  // Land on the requested page, and keep it in view when the zoom changes the page height.
  useEffect(() => {
    scrollToPage(pageNow.current, false);
  }, [zoom, showThumbs, fullscreen]);

  // Keep the active thumbnail centred inside the rail (scrollIntoView would scroll the whole page).
  useEffect(() => {
    const el = thumbEls.current.get(page);
    const rail = railRef.current;
    if (!el || !rail) return;
    rail.scrollTo({ top: el.offsetTop - rail.clientHeight / 2 + el.clientHeight / 2, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    function onKey(e) {
      if (e.target.closest?.("input, textarea")) return;
      if (e.key === "ArrowRight") goTo(pageNow.current + 1);
      if (e.key === "ArrowLeft") goTo(pageNow.current - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen?.();
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex flex-col overflow-hidden border bg-card",
        fullscreen ? "h-dvh" : "h-[84dvh] min-h-[520px] rounded-2xl shadow-sm",
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/50 px-3 py-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setShowThumbs((v) => !v)}
            aria-label="Toggle thumbnails"
            aria-pressed={showThumbs}
          >
            <PanelLeft />
          </Button>
          <Button variant="outline" size="icon" onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page">
            <ChevronLeft />
          </Button>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goTo(pageInput);
            }}
            className="flex items-center gap-1.5 px-1 text-sm"
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
              className="h-9 w-11 rounded-md border bg-background text-center tabular-nums outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <span className="text-muted-foreground">/ {total}</span>
          </form>
          <Button variant="outline" size="icon" onClick={() => goTo(page + 1)} disabled={page === total} aria-label="Next page">
            <ChevronRight />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(z - 1, 0))} disabled={zoom === 0} aria-label="Zoom out">
            <Minus />
          </Button>
          <button
            type="button"
            onClick={() => setZoom(DEFAULT_ZOOM)}
            title="Reset zoom"
            className="w-14 rounded-md py-1.5 text-center text-xs tabular-nums hover:bg-accent"
          >
            {Math.round(factor * 100)}%
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setZoom((z) => Math.min(z + 1, ZOOMS.length - 1))}
            disabled={zoom === ZOOMS.length - 1}
            aria-label="Zoom in"
          >
            <Plus />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit full screen" : "Full screen"}>
            {fullscreen ? <Minimize2 /> : <Maximize2 />}
          </Button>
        </div>
      </div>

      {/* What's on this page → product pages */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-4 py-2 text-sm">
        <span className="font-semibold">
          Page {current.number}
          {current.label !== `Page ${current.number}` && (
            <span className="font-normal text-muted-foreground"> · {current.label}</span>
          )}
        </span>
        <ul className="flex flex-wrap gap-1.5">
          {current.products.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/products/${p.slug}`}
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs hover:bg-accent"
              >
                {p.name}
                <ArrowUpRight className="size-3 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" size="sm" className="ml-auto">
          <Link href={current.brandSlug ? `/contact?brand=${current.brandSlug}` : "/contact"}>Enquire about this page</Link>
        </Button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Thumbnail rail (desktop) */}
        {showThumbs && (
          <nav aria-label="Catalogue pages" className="hidden w-32 shrink-0 border-r bg-muted/30 md:block">
            <ul ref={railRef} className="relative h-full space-y-3 overflow-y-auto p-3">
              {pages.map((p) => (
                <li key={p.number}>
                  <button
                    type="button"
                    ref={(el) => (el ? thumbEls.current.set(p.number, el) : thumbEls.current.delete(p.number))}
                    onClick={() => goTo(p.number)}
                    aria-label={`Page ${p.number}: ${p.label}`}
                    aria-current={p.number === page ? "page" : undefined}
                    className={cn("block w-full text-left", p.number === page ? "opacity-100" : "opacity-60 hover:opacity-100")}
                  >
                    <span
                      className={cn(
                        "relative block aspect-[1/1.414] overflow-hidden rounded-sm border-2 bg-white transition-colors",
                        p.number === page ? "border-primary" : "border-transparent",
                      )}
                    >
                      <Image src={p.src} alt="" fill sizes="112px" className="object-cover" />
                    </span>
                    <span className="mt-1 block text-center text-[11px] tabular-nums text-muted-foreground">{p.number}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Reading pane: all pages in one scroll */}
        <div
          ref={paneRef}
          onScroll={onScroll}
          className="relative min-w-0 flex-1 overflow-auto bg-neutral-200 p-2 sm:p-4 dark:bg-neutral-900"
        >
          <div className="space-y-4">
            {pages.map((p) => (
              <div
                key={p.number}
                ref={(el) => (el ? pageEls.current.set(p.number, el) : pageEls.current.delete(p.number))}
                style={{ width: `calc(min(100%, 60rem) * ${factor})` }}
                className="mx-auto bg-white shadow-lg"
              >
                <Image
                  src={p.src}
                  alt={`Catalogue page ${p.number}: ${p.label}`}
                  width={p.width}
                  height={p.height}
                  priority={p.number === initialPage}
                  unoptimized={factor > 1.25}
                  placeholder="blur"
                  blurDataURL={p.blurDataURL}
                  sizes={factor <= 1 ? "(min-width: 1024px) 960px, 100vw" : "1200px"}
                  className="h-auto w-full select-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
