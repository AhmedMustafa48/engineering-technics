import Link from "next/link";
import { Mail, MessageCircle, Phone, FileText, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";
import { enquiryMessage, getContact, mailtoHref, telHref, whatsappHref } from "@/lib/contact";
import { absoluteUrl } from "@/lib/site";

// Everything needed to contact whoever supplies this product, with the
// product name and page URL pre-filled into email and WhatsApp messages.
export function getEnquiryLinks(product) {
  const contact = getContact(product, product.brand);
  const recipient = contact.isDirect ? product.brand.name : company.name;
  const subject = `${product.brand.name} ${product.name}`;
  const url = absoluteUrl(`/products/${product.slug}`);
  const message = enquiryMessage(subject, url, recipient);
  return {
    contact,
    recipient,
    email: contact.email ? mailtoHref(contact.email, `Enquiry: ${subject}`, message) : null,
    phone: telHref(contact.phoneIntl || contact.phone),
    whatsapp: whatsappHref(contact.whatsapp, message),
    form: `/contact?product=${product.slug}`,
  };
}

// tone="inverse" for use on the dark brand panel.
export function EnquiryButtons({ links, size = "lg", tone, className }) {
  const inverse = tone === "inverse";
  return (
    <div className={className}>
      {links.email && (
        <Button asChild size={size} variant={inverse ? "inverse" : "default"}>
          <a href={links.email}>
            <Mail /> Email enquiry
          </a>
        </Button>
      )}
      {links.whatsapp && (
        <Button asChild size={size} className="bg-[#1f9d55] text-white hover:bg-[#1a8a4a]">
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle /> WhatsApp
          </a>
        </Button>
      )}
      {links.phone && (
        <Button asChild size={size} variant={inverse ? "inverse-outline" : "outline"}>
          <a href={links.phone}>
            <Phone /> Call
          </a>
        </Button>
      )}
    </div>
  );
}

export function EnquiryPanel({ product }) {
  const links = getEnquiryLinks(product);
  const { contact } = links;

  return (
    <section
      id="enquire"
      aria-labelledby="enquire-heading"
      className="scroll-mt-36 overflow-hidden rounded-2xl border bg-card shadow-sm"
    >
      <div className="border-b bg-primary px-6 py-5 text-primary-foreground">
        <p className="text-xs font-medium uppercase tracking-wider opacity-80">
          {contact.isDirect ? "Contact the maker" : "Contact maker & supplier"}
        </p>
        <h2 id="enquire-heading" className="mt-1 text-lg font-semibold">
          Enquire about this product
        </h2>
      </div>

      <div className="space-y-5 p-6">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Manufacturer</dt>
          <dd className="font-medium">
            <Link href={`/brands/${product.brand.slug}`} className="hover:text-primary hover:underline">
              {product.brand.fullName}
            </Link>
          </dd>
          <dt className="text-muted-foreground">{contact.isDirect ? "Contact" : "Supplied by"}</dt>
          <dd className="font-medium">{links.recipient}</dd>
        </dl>

        <EnquiryButtons links={links} className="grid gap-2 [&>a]:w-full" />

        <ul className="space-y-2.5 border-t pt-5 text-sm">
          {contact.email && (
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-muted-foreground" />
              <a href={links.email} className="break-all hover:text-primary">
                {contact.email}
              </a>
            </li>
          )}
          {contact.phone && (
            <li className="flex items-center gap-3">
              <Phone className="size-4 shrink-0 text-muted-foreground" />
              <a href={links.phone} className="hover:text-primary">
                {contact.phone}
              </a>
            </li>
          )}
          {!contact.isDirect && (
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">
                {company.address.street}, {company.address.city}
              </span>
            </li>
          )}
        </ul>

        <Link
          href={links.form}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <FileText className="size-4" /> Prefer a form? Send a detailed enquiry
        </Link>
      </div>
    </section>
  );
}

// Always-reachable enquiry actions on small screens, where the panel is far down the page.
// Sticky (not fixed) so it rests at the end of the article instead of covering the footer.
export function MobileEnquiryBar({ product }) {
  const links = getEnquiryLinks(product);
  return (
    <div className="sticky bottom-0 z-30 border-t bg-background/90 p-3 backdrop-blur lg:hidden">
      <EnquiryButtons links={links} size="default" className="flex gap-2 [&>a]:flex-1" />
    </div>
  );
}
