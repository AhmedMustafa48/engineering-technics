import { Suspense } from "react";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone, Printer } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Button } from "@/components/ui/button";
import { ContactForm, ContactFormFromParams } from "@/components/contact/contact-form";
import { company } from "@/data/company";
import { companyMapsUrl, mailtoHref, telHref, whatsappHref } from "@/lib/contact";
import { getEnquiryTopics } from "@/lib/enquiry-topics";

export const metadata = {
  title: "Contact",
  description: `Contact ${company.name} in Lahore for quotations, specifications and lead times — email ${company.contact.email} or call ${company.contact.phone}.`,
  alternates: { canonical: "/contact" },
};

function Channel({ icon: Icon, label, value, href, external }) {
  const content = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-foreground">
        <Icon className="size-4.5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block break-words font-medium">{value}</span>
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="flex items-center gap-4 rounded-lg p-2 -m-2 transition-colors hover:bg-accent"
        >
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-4">{content}</div>
      )}
    </li>
  );
}

export default function ContactPage() {
  const topics = getEnquiryTopics();
  const { address, contact } = company;
  const addressLine = `${address.street}, ${address.city}, ${address.country}`;
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(addressLine)}&z=15&output=embed`;
  const whatsapp = whatsappHref(contact.whatsapp, `Hello ${company.name}, I have an enquiry.`);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Contact" }]}
        title="Contact us"
        description="Tell us what you need — product, rating, quantity — and we'll come back with specifications, pricing and lead times from the manufacturer."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="inverse" size="lg">
            <a href={mailtoHref(contact.email)}>
              <Mail /> {contact.email}
            </a>
          </Button>
          <Button asChild variant="inverse-outline" size="lg">
            <a href={telHref(contact.phoneIntl)}>
              <Phone /> {contact.phone}
            </a>
          </Button>
        </div>
      </PageHeader>

      <div className="container-page grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        <section aria-labelledby="form-heading" className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-foreground">Enquiry form</p>
          <h2 id="form-heading" className="mt-2 mb-6 text-2xl font-semibold">
            Send an enquiry
          </h2>
          <Suspense fallback={<ContactForm topics={topics} />}>
            <ContactFormFromParams topics={topics} />
          </Suspense>
        </section>

        <aside className="space-y-6">
          <section aria-labelledby="direct-heading" className="spotlight rounded-2xl border bg-card p-6">
            <h2 id="direct-heading" className="mb-5 font-semibold">
              Reach us directly
            </h2>
            <address className="not-italic">
              <ul className="space-y-5">
                <Channel icon={Mail} label="Email" value={contact.email} href={mailtoHref(contact.email)} />
                <Channel icon={Phone} label="Phone" value={contact.phone} href={telHref(contact.phoneIntl)} />
                {whatsapp && <Channel icon={MessageCircle} label="WhatsApp" value="Chat with us" href={whatsapp} external />}
                <Channel icon={Printer} label="Fax" value={contact.fax} />
                <Channel icon={MapPin} label="Office" value={addressLine} href={companyMapsUrl()} external />
              </ul>
            </address>
          </section>

          <section aria-label="Map" className="overflow-hidden rounded-2xl border bg-card">
            <iframe
              title={`Map showing ${company.name}, ${addressLine}`}
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full border-0 grayscale-[35%]"
            />
            <a
              href={companyMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border-t px-5 py-3 text-sm font-medium hover:bg-accent"
            >
              Open in Google Maps <ExternalLink className="size-4 text-muted-foreground" />
            </a>
          </section>
        </aside>
      </div>
    </>
  );
}
