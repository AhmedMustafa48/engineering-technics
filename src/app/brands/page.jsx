import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { PanelStats } from "@/components/site/brand-panel";
import { BrandLogo } from "@/components/catalog/brand-logo";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { getBrands } from "@/lib/catalog";

export const metadata = {
  title: "Suppliers",
  description:
    "The international manufacturers that supply Engineering Technics, and the items each one provides.",
  alternates: { canonical: "/brands" },
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <>
      <PageHeader
        image="suppliers"
        crumbs={[{ label: "Suppliers" }]}
        title="Our suppliers"
        description="The manufacturers behind every item we supply. Open a supplier to see exactly what they provide."
        aside={<PanelStats items={[[brands.reduce((n, b) => n + b.itemCount, 0), "Items supplied"]]} />}
      />
      <div className="container-page py-10 sm:py-14">
        <Stagger as="ul" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
          {brands.map((b) => (
            <StaggerItem as="li" key={b.slug}>
              <div className="spotlight group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                {/* The logo opens the supplier's official site; the rest of the card opens its items. */}
                {b.website ? (
                  <a
                    href={b.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${b.fullName} official website (opens in a new tab)`}
                    title={`Visit ${b.website.replace(/^https?:\/\//, "")}`}
                    className="relative z-[3] block border-b bg-white transition-colors hover:bg-slate-50"
                  >
                    <BrandLogo brand={b} className="h-28 rounded-none bg-transparent" imageClassName="h-14" />
                  </a>
                ) : (
                  <BrandLogo brand={b} className="h-28 rounded-none border-b" imageClassName="h-14" />
                )}
                <Link href={`/brands/${b.slug}`} className="relative z-[3] flex flex-1 flex-col bg-card p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-semibold">{b.fullName}</h2>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {b.itemCount} {b.itemCount === 1 ? "item" : "items"}
                    </span>
                  </div>
                  {b.country && <p className="mt-0.5 text-xs text-muted-foreground">{b.country}</p>}
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary">
                    View items
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </>
  );
}
