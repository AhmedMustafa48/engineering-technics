import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Layers3, MousePointerClick } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

// Three real catalogue pages fanned out; they spread further on hover.
const FAN = [
  "-rotate-[10deg] -translate-x-[38%] group-hover:-rotate-[14deg] group-hover:-translate-x-[52%]",
  "rotate-0 z-10 group-hover:-translate-y-3",
  "rotate-[10deg] translate-x-[38%] group-hover:rotate-[14deg] group-hover:translate-x-[52%]",
];

export function CatalogueTeaser({ pages, pageCount, brandCount, pdf, pdfSize }) {
  return (
    <div className="grid items-center gap-14 lg:grid-cols-2">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-foreground">Online catalogue</p>
        <h2 id="catalogue-heading" className="mt-2 text-3xl font-semibold sm:text-4xl">
          The full catalogue, one swipe away.
        </h2>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">
          Every page of the Engineering Technics catalogue in your browser — no download needed. Each page links
          straight to the product details.
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          <li className="flex items-center gap-3">
            <Layers3 className="size-4 text-brand" /> {pageCount} pages covering {brandCount} manufacturers
          </li>
          <li className="flex items-center gap-3">
            <MousePointerClick className="size-4 text-brand" /> Jump from any page to its products and enquire
          </li>
          <li className="flex items-center gap-3">
            <Download className="size-4 text-brand" /> PDF download available ({pdfSize})
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/catalogue">
              Open catalogue <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={pdf} download="Engineering-Technics-Catalogue.pdf">
              <Download /> Download PDF
            </a>
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <Link href="/catalogue" aria-label="Open the catalogue" className="group relative mx-auto block aspect-[4/3.4] w-full max-w-lg">
          {pages.slice(0, 3).map((p, i) => (
            <span
              key={p.number}
              className={`absolute left-1/2 top-1/2 w-[46%] -translate-y-1/2 -ml-[23%] transition-transform duration-500 ease-out ${FAN[i]}`}
            >
              <span className="relative block aspect-[1/1.414] overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/5">
                <Image src={p.src} alt="" fill sizes="240px" placeholder="blur" blurDataURL={p.blurDataURL} className="object-cover" />
              </span>
            </span>
          ))}
        </Link>
      </Reveal>
    </div>
  );
}
