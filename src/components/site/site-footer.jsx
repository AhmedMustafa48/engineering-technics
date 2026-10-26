import Link from "next/link";
import { Mail, MapPin, Phone, Printer } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { company } from "@/data/company";
import { getCategories } from "@/lib/catalog";
import { mailtoHref, telHref } from "@/lib/contact";
import { mainNav } from "@/lib/site";

function FooterHeading({ children }) {
  return <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</h2>;
}

export function SiteFooter() {
  const { address, contact } = company;
  const categories = getCategories().slice(0, 7);

  return (
    <footer className="relative mt-20 overflow-hidden border-t bg-muted/40">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1.1fr_1.2fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{company.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <FooterHeading>Explore</FooterHeading>
          <ul className="space-y-2.5 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-foreground/80 transition-colors hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Categories">
          <FooterHeading>Categories</FooterHeading>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="text-foreground/80 transition-colors hover:text-primary">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="font-medium text-primary hover:underline">
                All categories →
              </Link>
            </li>
          </ul>
        </nav>

        <address className="not-italic">
          <FooterHeading>Get in touch</FooterHeading>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>
                {address.street}, {address.city}, {address.country}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <a href={telHref(contact.phoneIntl)} className="hover:text-primary">
                {contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Printer className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span>Fax {contact.fax}</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <a href={mailtoHref(contact.email)} className="hover:text-primary">
                {contact.email}
              </a>
            </li>
          </ul>
        </address>
      </div>

      {/* Oversized wordmark as a quiet closing flourish. */}
      <div aria-hidden className="container-page select-none overflow-hidden">
        <p className="translate-y-[28%] bg-gradient-to-b from-foreground/[0.07] to-transparent bg-clip-text text-center text-[clamp(2rem,6.4vw,5.9rem)] leading-none font-bold tracking-tighter whitespace-nowrap text-transparent">
          ENGINEERING TECHNICS
        </p>
      </div>

      <div className="relative border-t bg-muted/60">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <p>Brand names and trademarks belong to their respective owners.</p>
        </div>
      </div>
    </footer>
  );
}
