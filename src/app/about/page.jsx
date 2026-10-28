import Link from "next/link";
import { ArrowRight, Globe2, Handshake, ShieldCheck, Wrench } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo";
import { getBrands, getItemCount, getProducts } from "@/lib/catalog";
import { company } from "@/data/company";

export const metadata = {
  title: "About Us",
  description: `${company.name} is a Lahore-based supplier of transformer components, protection relays, meters and insulation from leading international manufacturers.`,
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: ShieldCheck, title: "Trusted makers", text: "We only supply from established international manufacturers, so every part comes with a proven pedigree." },
  { icon: Globe2, title: "Global sourcing", text: "One Lahore partner for components made across Europe, Asia and the Americas." },
  { icon: Wrench, title: "Technical support", text: "Specifications, ratings and lead times confirmed with the manufacturer before you order." },
  { icon: Handshake, title: "Long-term service", text: "Utilities, transformer builders and industry rely on us for repeat, dependable supply." },
];

export default async function AboutPage() {
  const [products, brands, itemCount] = await Promise.all([getProducts(), getBrands(), getItemCount()]);
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "About Us", path: "/about" }])} />
      <PageHeader
        image="about"
        crumbs={[{ label: "About Us" }]}
        title="About Engineering Technics"
        description={company.tagline}
      />

      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <section aria-labelledby="who">
            <h2 id="who" className="text-2xl font-semibold">Who we are</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{company.description}</p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Based at {company.officeAddress.street}, {company.officeAddress.city}, we connect Pakistan&apos;s power sector with the
              manufacturers behind the components inside every transformer — from radiators and cooling fans to relays,
              meters, tap changers and insulation.
            </p>
            <Button asChild className="mt-6">
              <Link href="/contact">
                Talk to us <ArrowRight />
              </Link>
            </Button>
          </section>

          <dl className="grid grid-cols-2 gap-4 self-start rounded-2xl border bg-card p-6">
            {[
              [products.length, "Products"],
              [itemCount, "Items"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="text-xs text-muted-foreground">{l}</dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <section aria-labelledby="values" className="mt-14">
          <h2 id="values" className="text-2xl font-semibold">Why customers choose us</h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border bg-card p-5">
                <span className="grid size-10 place-items-center rounded-lg bg-brand-soft text-brand-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
