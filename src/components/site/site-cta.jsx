"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { BrandPanel } from "@/components/site/brand-panel";
import { company } from "@/data/company";
import { mailtoHref, telHref } from "@/lib/contact";

// Closing call-to-action on every page except /contact, where it would be redundant.
export function SiteCta() {
  const pathname = usePathname();
  if (pathname.startsWith("/contact")) return null;

  return (
    <section aria-labelledby="cta-heading" className="container-page mt-24">
      <Reveal>
        <BrandPanel glow="right" innerClassName="grid items-center gap-10 px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-[1.4fr_1fr] lg:px-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">Get a quotation</p>
            <h2 id="cta-heading" className="mt-3 text-3xl font-semibold sm:text-5xl">
              Tell us what you need. <span className="text-white/60">We&apos;ll handle the makers.</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg text-white/70">
              Specifications, pricing and lead times for any product in our range — or something you can&apos;t find here.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button asChild size="lg" variant="inverse" className="h-12">
              <Link href="/contact">
                Send an enquiry <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="inverse-outline" className="h-12">
              <a href={mailtoHref(company.contact.email, "Enquiry")}>
                <Mail /> {company.contact.email}
              </a>
            </Button>
            <Button asChild size="lg" variant="inverse-outline" className="h-12">
              <a href={telHref(company.contact.phoneIntl)}>
                <Phone /> {company.contact.phone}
              </a>
            </Button>
          </div>
        </BrandPanel>
      </Reveal>
    </section>
  );
}
