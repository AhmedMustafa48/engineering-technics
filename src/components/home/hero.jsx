import Link from "next/link";
import { ArrowRight, Globe2, ShieldCheck, Users, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { HeroBackdrop } from "@/components/effects/hero-backdrop";
import { heroSlides } from "@/lib/hero-photo";
import { company } from "@/data/company";

const BADGES = [
  { icon: ShieldCheck, label: "Trusted", sub: "Makers" },
  { icon: Settings2, label: "Global", sub: "Supply Chain" },
  { icon: Users, label: "Expert", sub: "Technical Support" },
  { icon: Globe2, label: "Powering", sub: "Industries" },
];

export function Hero({ stats }) {
  const words = company.slogan.split(" ");
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden text-white">
      <HeroBackdrop images={heroSlides} />
      <div className="container-page relative flex min-h-[560px] drop-shadow-[0_2px_10px_rgb(0_0_0/0.6)] flex-col justify-center py-16 sm:min-h-[640px] sm:py-24">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/90 sm:text-sm">
            Reliable Power <span className="mx-2 text-sky-400">\</span> Stronger Tomorrow
          </p>
        </FadeIn>

        <h1 id="hero-heading" className="mt-6 max-w-4xl font-extrabold uppercase leading-[1.02] tracking-tight">
          {words.map((w, i) => (
            <span
              key={`${w}-${i}`}
              className={`animate-word inline-block pr-[0.28em] text-4xl sm:text-6xl lg:text-7xl ${i < 2 ? "text-gradient-bright" : ""}`}
              style={{ animationDelay: `${0.05 + i * 0.07}s` }}
            >
              {w}
            </span>
          ))}
        </h1>

        <FadeIn delay={0.4}>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {BADGES.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon aria-hidden className="size-7 text-sky-400" />
                <span className="text-sm font-semibold leading-tight">
                  {label}
                  <span className="block font-medium text-white/80">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.5} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" variant="brand" className="h-12 px-6 text-base">
            <Link href="/products">
              Explore Our Products <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="inverse-outline" className="h-12 px-6 text-base font-semibold">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </FadeIn>

        <p className="mt-8 text-sm text-white/70">
          {stats.items}+ items from leading international manufacturers · Lahore, Pakistan
        </p>
      </div>
    </section>
  );
}
