import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { PanelStats } from "@/components/site/brand-panel";
import { BrandLogo } from "@/components/catalog/brand-logo";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { getBrands } from "@/lib/catalog";

export const metadata = {
  title: "Brands",
  description:
    "International manufacturers represented by Engineering Technics: GE, Elprom, HIKMICRO, Elster, MIDEL, COMEM, Bussmann, Isovolta and more.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  const brands = getBrands();

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Brands" }]}
        title="Brands we represent"
        description="International manufacturers covering protection, metering, transformers, accessories, insulation and circuit protection."
        aside={<PanelStats items={[[brands.length, "Manufacturers"], [brands.reduce((n, b) => n + b.productCount, 0), "Product lines"]]} />}
      />
      <div className="container-page py-10 sm:py-14">
        <Stagger as="ul" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.04}>
          {brands.map((b) => (
            <StaggerItem as="li" key={b.slug}>
              <Link
                href={`/brands/${b.slug}`}
                className="spotlight group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
              >
                <BrandLogo brand={b} className="h-28 rounded-none border-b" />
                <div className="relative z-[3] flex flex-1 flex-col bg-card p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-semibold">{b.fullName}</h2>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {b.productCount} {b.productCount === 1 ? "product" : "products"}
                    </span>
                  </div>
                  {b.country && <p className="mt-0.5 text-xs text-muted-foreground">{b.country}</p>}
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary">
                    View products
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </>
  );
}
