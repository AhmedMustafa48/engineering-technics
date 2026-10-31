import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { HeroBackdrop } from "@/components/effects/hero-backdrop";
import { heroImages } from "@/lib/hero-photo";

// Breadcrumbs styled for the dark hero. `crumbs` excludes Home and ends
// with the current page: [{ href?, label }].
export function PanelBreadcrumb({ crumbs }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/65">
        <li>
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
        </li>
        {crumbs.map((c, i) => {
          const current = i === crumbs.length - 1 || !c.href;
          return (
            <li key={c.label} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight aria-hidden className="size-3.5 shrink-0 text-white/35" />
              {current ? (
                <span aria-current="page" className="line-clamp-1 text-white/95">
                  {c.label}
                </span>
              ) : (
                <Link href={c.href} className="transition-colors hover:text-white">
                  {c.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Inner-page hero: the same full-bleed dusk-substation banner as home, with the page title on top.
export function PageHeader({ image = "products", crumbs = [], eyebrow, title, description, aside, children }) {
  return (
    <section className="relative isolate overflow-hidden text-white">
      <HeroBackdrop image={heroImages[image] ?? heroImages.products} />
      <div className="container-page relative flex min-h-[420px] drop-shadow-[0_2px_10px_rgb(0_0_0/0.6)] flex-col justify-center py-14 sm:min-h-[500px] sm:py-20">
        <div className="max-w-4xl">
          <FadeIn>
            <PanelBreadcrumb crumbs={crumbs} />
          </FadeIn>
          <FadeIn delay={0.05} className="mt-8">
            {eyebrow && <div className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-sky-400">{eyebrow}</div>}
            <h1 className="text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">{title}</h1>
            {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/85">{description}</p>}
          </FadeIn>
          {children && <FadeIn delay={0.12}>{children}</FadeIn>}
          {aside && (
            <FadeIn delay={0.15} className="mt-8">
              {aside}
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}
