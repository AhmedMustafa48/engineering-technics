import Link from "next/link";
import { ArrowRight, BookOpen, Handshake, Rocket, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/site/icon-tile";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo";
import { company } from "@/data/company";

export const metadata = {
  title: "About Us",
  description: `${company.name} has been an indenting house in Lahore since 1985, supplying products from international principals to electrical manufacturers and industry.`,
  alternates: { canonical: "/about" },
};

const SCOPE = ["Transformers", "Switchgear", "Appliances", "Motors & Alternators", "System Providers"];

const SECTIONS = [
  {
    icon: Handshake,
    title: "Commitment to the Customer",
    text: "We give the utmost attention to guaranteeing high performance in all our activities: from availability of our Principals products, administration management, logistics and synergistic collaboration with the customer, after-sales service including approvals. At all times we maintain a strict balance between timely deliveries and optimum service.",
  },
  {
    icon: ShieldCheck,
    title: "Confidence of Suppliers",
    text: "Some of the agencies and business representations held by us are more than three decades old and reaffirm the confidence of our Principals in us.",
  },
  {
    icon: BookOpen,
    title: "Products Include",
    text: "The catalogue will give you a brief synopsis of the products of our principals and an idea of our activities.",
  },
  {
    icon: Rocket,
    title: "Future Plans",
    text: "To expand our customer base without compromising on the quality of our services and expand the numbers of items in our product range so that our customers have a one-stop shop for quality products.",
  },
];

export default function AboutPage() {
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
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <section aria-labelledby="profile">
            <h2 id="profile" className="text-2xl font-semibold">Company Profile</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Since 1985 we have been working as an Indenting house having its registered office in Lahore. In more than
              40 years, the company has steadily widened its customer base and turnover and with the induction of young
              professionals, Engineering Technics has continued to explore new avenues. The company&apos;s core team
              comprises of qualified sales engineers and administrative staff members. Over the years Engineering
              Technics indenting business has grown to millions of Euros and has also increased its stock sales.
            </p>
            <Button asChild className="mt-6">
              <Link href="/contact">
                Talk to us <ArrowRight />
              </Link>
            </Button>
          </section>

          <aside aria-labelledby="scope" className="self-start rounded-2xl border bg-card p-6">
            <h2 id="scope" className="text-lg font-semibold">Scope Of Activities Includes</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Marketing of products from international principals to large &amp; small electrical manufacturers including
            </p>
            <ul className="mt-4 space-y-2 text-sm font-medium">
              {SCOPE.map((s) => (
                <li key={s} className="flex items-center gap-2.5">
                  <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Besides the above, components are also supplied to the industry in general for new projects / replacement
              etc., where the OEM has supplied its Switchgear / Transformers.
            </p>
          </aside>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {SECTIONS.map(({ icon, title, text }, i) => (
            <li key={title} className="rounded-2xl border bg-card p-6">
              <IconTile icon={icon} index={i} />
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-center text-lg font-medium">
          We look forward to doing business with your esteemed organization.
        </p>
      </div>
    </>
  );
}
