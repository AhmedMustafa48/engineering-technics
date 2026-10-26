import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { BrandPanel } from "@/components/site/brand-panel";

// Breadcrumbs styled for the dark brand panel. `crumbs` excludes Home and ends
// with the current page: [{ href?, label }].
export function PanelBreadcrumb({ crumbs }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/55">
        <li>
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
        </li>
        {crumbs.map((c, i) => {
          const current = i === crumbs.length - 1 || !c.href;
          return (
            <li key={c.label} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight aria-hidden className="size-3.5 shrink-0 text-white/30" />
              {current ? (
                <span aria-current="page" className="line-clamp-1 text-white/90">
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

// Inner-page header: a compact version of the home hero on the same brand panel.
export function PageHeader({ crumbs = [], eyebrow, title, description, aside, children }) {
  return (
    <section className="container-page pt-3 sm:pt-5">
      <BrandPanel innerClassName="grid items-end gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1fr_auto] lg:px-14">
        <div className="max-w-3xl">
          <FadeIn>
            <PanelBreadcrumb crumbs={crumbs} />
          </FadeIn>
          <FadeIn delay={0.05} className="mt-8">
            {eyebrow && <div className="mb-3 text-sm font-medium text-cyan-300">{eyebrow}</div>}
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            {description && <p className="mt-4 text-lg leading-relaxed text-white/70">{description}</p>}
          </FadeIn>
          {children && <FadeIn delay={0.12}>{children}</FadeIn>}
        </div>
        {aside && <FadeIn delay={0.15}>{aside}</FadeIn>}
      </BrandPanel>
    </section>
  );
}
