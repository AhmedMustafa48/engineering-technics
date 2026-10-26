import { Suspense } from "react";
import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { PanelStats } from "@/components/site/brand-panel";
import { CatalogueViewer } from "@/components/catalogue/catalogue-viewer";
import { formatBytes, getCatalogue } from "@/lib/catalogue";
import { getBrands } from "@/lib/catalog";

export const metadata = {
  title: "Product Catalogue",
  description:
    "Flip through the Engineering Technics product catalogue online — protection relays, meters, transformers, accessories, insulation and fuses — or download the PDF.",
  alternates: { canonical: "/catalogue" },
};

// Prerendered stand-in until the client viewer reads ?page=N: the cover plus
// a plain list of every page, so the content is reachable without JavaScript.
function StaticCatalogue({ pages }) {
  const cover = pages[0];
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="relative mx-auto aspect-[1/1.414] w-full max-w-3xl overflow-hidden rounded-md border bg-white">
        <Image src={cover.src} alt="Catalogue cover" fill priority sizes="(min-width: 1024px) 768px, 100vw" className="object-contain" />
      </div>
      <ol className="space-y-1 text-sm">
        {pages.map((p) => (
          <li key={p.number}>
            <a href={p.src} className="hover:text-primary">
              {p.number}. {p.label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function CataloguePage() {
  const { pdf, pdfBytes, pages } = getCatalogue();
  const brandCount = getBrands().length;

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Catalogue" }]}
        title="Product catalogue"
        description="Flip through every page online, from protection relays to insulation materials. Each page links to the matching product details."
        aside={<PanelStats items={[[pages.length, "Pages"], [brandCount, "Manufacturers"], [formatBytes(pdfBytes), "PDF size"]]} />}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="inverse" size="lg">
            <a href={pdf} download="Engineering-Technics-Catalogue.pdf">
              <Download /> Download PDF
            </a>
          </Button>
          <Button asChild variant="inverse-outline" size="lg">
            <a href={pdf} target="_blank" rel="noopener noreferrer">
              <ExternalLink /> Open PDF in new tab
            </a>
          </Button>
        </div>
      </PageHeader>

      <div className="container-page py-8 sm:py-12">
        <Suspense fallback={<StaticCatalogue pages={pages} />}>
          <CatalogueViewer pages={pages} />
        </Suspense>
      </div>
    </>
  );
}
