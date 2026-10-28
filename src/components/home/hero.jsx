import Link from "next/link";
import { ArrowRight, Globe2, ShieldCheck, Users, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { HeroBackdrop } from "@/components/effects/hero-backdrop";
import { heroImages } from "@/lib/hero-photo";

const BADGES = [
  { icon: ShieldCheck, label: "Trusted", sub: "Makers" },
  { icon: Settings2, label: "Global", sub: "Supply Chain" },
  { icon: Users, label: "Expert", sub: "Technical Support" },
  { icon: Globe2, label: "Powering", sub: "Industries" },
];

export function Hero({ stats }) {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden text-white">
      <HeroBackdrop image={heroImages.home} />
      <div className="container-page relative flex min-h-[560px] flex-col justify-center py-16 sm:min-h-[640px] sm:py-24">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/90 sm:text-sm">
            Reliable Power <span className="mx-2 text-amber-400">\</span> Stronger Tomorrow
          </p>
        </FadeIn>

        <h1 id="hero-heading" className="mt-5 max-w-3xl font-extrabold uppercase leading-[0.95] tracking-tight">
          <span className="animate-word block text-5xl sm:text-7xl lg:text-8xl" style={{ animationDelay: "0.05s" }}>
            Engineering
          </span>
          <span className="animate-word block bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-5xl text-transparent sm:text-7xl lg:text-8xl" style={{ animationDelay: "0.15s" }}>
            Technics
          </span>
        </h1>

        <FadeIn delay={0.3}>
          <p className="mt-6 max-w-xl text-xl font-medium leading-snug text-white/90 sm:text-2xl">
            Your trusted partner for power transformer components and protection equipment.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {BADGES.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon aria-hidden className="size-7 text-amber-400" />
                <span className="text-sm font-semibold leading-tight">
                  {label}
                  <span className="block font-medium text-white/80">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <FadeIn delay={0.5} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 bg-amber-400 px-6 text-base font-semibold text-slate-950 hover:bg-amber-300">
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
