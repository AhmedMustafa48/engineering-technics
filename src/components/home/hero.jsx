import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { BrandPanel } from "@/components/site/brand-panel";
import { CountUp } from "@/components/home/count-up";
import { RotatingCategory } from "@/components/home/rotating-category";
import { HeroShowcase } from "@/components/home/hero-showcase";

const HEADLINE = ["Everything", "a", "power", "transformer", "needs,"];
const ACCENT = ["from", "makers", "you", "trust."];

// Headline words rise in one after another (CSS only, so it paints before hydration).
function AnimatedWords({ words, offset = 0, className }) {
  return words.map((w, i) => (
    <span key={`${w}-${i}`} className={`animate-word inline-block ${className ?? ""}`} style={{ animationDelay: `${0.05 + (offset + i) * 0.06}s` }}>
      {w}
      {" "}
    </span>
  ));
}

export function Hero({ stats, categories, showcase }) {
  return (
    <section aria-labelledby="hero-heading" className="container-page pt-3 sm:pt-5">
      <BrandPanel innerClassName="grid items-center gap-12 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-14 lg:py-20">
          <div>
            <FadeIn>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-cyan-400" />
                </span>
                Transformer &amp; protection supply · Lahore, Pakistan
              </p>
            </FadeIn>

            <h1 id="hero-heading" className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              <AnimatedWords words={HEADLINE} />
              <AnimatedWords
                words={ACCENT}
                offset={HEADLINE.length}
                className="bg-gradient-to-r from-cyan-200 via-cyan-300 to-sky-400 bg-clip-text text-transparent"
              />
            </h1>

            <FadeIn delay={0.5}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
                Relays, meters, tap changers, accessories, insulation and fuses from {stats.brands} international
                manufacturers — sourced through one Lahore partner.
              </p>
              <p className="mt-4 text-base text-white/60">
                Explore <RotatingCategory items={categories} />
              </p>
            </FadeIn>

            <FadeIn delay={0.6} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="inverse" className="h-12 px-6">
                <Link href="/products">
                  Browse {stats.products} products <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="inverse-outline" className="h-12 px-6">
                <Link href="/catalogue">
                  <BookOpen /> Flip through the catalogue
                </Link>
              </Button>
            </FadeIn>

            <FadeIn delay={0.7}>
              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
                {[
                  [stats.brands, "Brands"],
                  [stats.categories, "Categories"],
                  [stats.products, "Product lines"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="text-xs text-white/50">{label}</dt>
                    <dd className="mt-1 text-3xl font-semibold">
                      <CountUp value={value} />
                    </dd>
                  </div>
                ))}
              </dl>
            </FadeIn>
          </div>

          <HeroShowcase products={showcase} />
      </BrandPanel>
    </section>
  );
}
