import Link from "next/link";
import { BrandLogo } from "@/components/catalog/brand-logo";

// Infinite logo strip. The list is rendered twice and the track slides by 50%,
// so the loop is seamless. Hovering pauses it.
export function BrandMarquee({ brands, heading }) {
  const row = (hidden) =>
    brands.map((b) => (
      <li key={`${b.slug}-${hidden ? "b" : "a"}`} aria-hidden={hidden || undefined} className="shrink-0">
        <Link
          href={`/brands/${b.slug}`}
          tabIndex={hidden ? -1 : undefined}
          title={b.fullName}
          className="block rounded-xl border bg-white grayscale transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:grayscale-0 dark:border-white/10"
        >
          <BrandLogo brand={b} className="h-16 w-40 bg-transparent" sizes="140px" />
        </Link>
      </li>
    ));

  return (
    <section aria-labelledby="brands-marquee-heading" className="py-12 sm:py-16">
      <h2 id="brands-marquee-heading" className="container-page text-center text-sm font-medium text-muted-foreground">
        {heading ?? (
          <>
            Representing <span className="font-semibold text-foreground">{brands.length} international manufacturers</span>
          </>
        )}
      </h2>
      <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ul className="animate-marquee flex w-max gap-4 py-2 group-hover:[animation-play-state:paused] [--marquee-duration:55s]">
          {row(false)}
          {row(true)}
        </ul>
      </div>
    </section>
  );
}
