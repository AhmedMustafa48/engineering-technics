import Link from "next/link";
import { BrandLogo } from "@/components/catalog/brand-logo";

// Infinite logo strip. The list is rendered twice and the track slides by 50%,
// so the loop is seamless. Hovering pauses it. Logos are display-only unless `linked` is set.
export function BrandMarquee({ brands, heading, linked = false }) {
  const row = (hidden) =>
    brands.map((b) => {
      const logo = <BrandLogo brand={b} className="h-16 w-40 bg-transparent" imageClassName="h-9" sizes="140px" />;
      return (
        <li key={`${b.slug}-${hidden ? "b" : "a"}`} aria-hidden={hidden || undefined} className="shrink-0">
          {linked ? (
            <Link
              href={`/brands/${b.slug}`}
              tabIndex={hidden ? -1 : undefined}
              title={b.fullName}
              className="block rounded-xl border bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10"
            >
              {logo}
            </Link>
          ) : (
            <div title={b.fullName} className="rounded-xl border bg-white shadow-sm dark:border-white/10">
              {logo}
            </div>
          )}
        </li>
      );
    });

  return (
    <section aria-labelledby="brands-marquee-heading" className="border-b bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 py-12 sm:py-14 dark:from-sky-950/30 dark:via-background dark:to-indigo-950/30">
      <h2 id="brands-marquee-heading" className="container-page text-center text-lg font-semibold">
        {heading ?? (
          <>
            Representing <span className="text-gradient">leading international manufacturers</span>
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
