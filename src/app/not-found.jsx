import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandPanel } from "@/components/site/brand-panel";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="container-page pt-3 sm:pt-5">
      <BrandPanel innerClassName="flex flex-col items-start px-6 py-20 sm:px-14 sm:py-28">
        <p className="font-mono text-sm text-cyan-300">404 · Circuit open</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">We couldn’t find that page.</h1>
        <p className="mt-5 max-w-lg text-lg text-white/70">
          The product may have moved. Browse the full range, or tell us what you’re looking for and we’ll help you find it.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild variant="inverse" size="lg">
            <Link href="/products">
              Browse products <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="inverse-outline" size="lg">
            <Link href="/contact">Contact us</Link>
          </Button>
        </div>
      </BrandPanel>
    </section>
  );
}
