"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail, MessageCircle, RotateCcw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mailtoHref, whatsappHref } from "@/lib/contact";

// Keep the composed mailto: URL under ~2k chars, which some Windows mail handlers cap.
const MESSAGE_MAX = 1000;

function composeEnquiry(topic, fields) {
  const subject = `Enquiry: ${topic.subject}${fields.company ? ` — ${fields.company}` : ""}`;
  const lines = [
    `Hello ${topic.to},`,
    "",
    fields.message.trim(),
    "",
    `Enquiry about: ${topic.subject}`,
    topic.url,
    fields.quantity && `Quantity: ${fields.quantity}`,
    "",
    "—",
    fields.name,
    fields.company,
    fields.email,
    fields.phone,
  ];
  return { subject, body: lines.filter((l) => l !== undefined && l !== null && l !== false).join("\n").replace(/\n{3,}/g, "\n\n") };
}

// Reads ?product= / ?brand= so "Enquire" links elsewhere pre-select the topic.
export function ContactFormFromParams(props) {
  const params = useSearchParams();
  const product = params.get("product");
  const brand = params.get("brand");
  const initialTopic = product ? `product:${product}` : brand ? `brand:${brand}` : "general";
  return <ContactForm {...props} initialTopic={initialTopic} />;
}

export function ContactForm({ topics, initialTopic = "general" }) {
  const byValue = useMemo(() => {
    const map = new Map([[topics.general.value, topics.general]]);
    for (const g of topics.groups) for (const item of g.items) map.set(item.value, item);
    return map;
  }, [topics]);

  const [topicValue, setTopicValue] = useState(byValue.has(initialTopic) ? initialTopic : "general");
  const [sent, setSent] = useState(null);
  const [copied, setCopied] = useState(false);
  const topic = byValue.get(topicValue);

  function onSubmit(e) {
    e.preventDefault();
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    const { subject, body } = composeEnquiry(topic, fields);
    const href = mailtoHref(topic.email, subject, body);
    setSent({ subject, body, email: topic.email, href, whatsapp: whatsappHref(topic.whatsapp, `${subject}\n\n${body}`) });
    setCopied(false);
    window.location.href = href;
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`To: ${sent.email}\nSubject: ${sent.subject}\n\n${sent.body}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="flex flex-col items-start"
          role="status"
        >
          <span className="grid size-12 place-items-center rounded-full bg-brand-soft text-brand-foreground">
            <Mail className="size-6" />
          </span>
          <h2 className="mt-5 text-2xl font-semibold">Your enquiry is ready to send</h2>
          <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
            We&apos;ve opened your email app with the message addressed to{" "}
            <span className="font-medium text-foreground">{sent.email}</span>. Just press <strong>Send</strong> there.
          </p>
          <div className="mt-6 w-full rounded-xl border bg-muted/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email didn&apos;t open?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Copy the message and paste it into any email, or send it another way.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyMessage}>
                {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy message"}
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={sent.href}>
                  <Mail /> Try email again
                </a>
              </Button>
              {sent.whatsapp && (
                <Button asChild size="sm" className="bg-[#1f9d55] text-white hover:bg-[#1a8a4a]">
                  <a href={sent.whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle /> Send via WhatsApp
                  </a>
                </Button>
              )}
            </div>
          </div>
          <Button variant="ghost" className="mt-6" onClick={() => setSent(null)}>
            <RotateCcw /> Edit enquiry
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          onSubmit={onSubmit}
          // Without JavaScript the browser falls back to a plain mailto submission.
          action={`mailto:${topic.email}`}
          method="post"
          encType="text/plain"
          className="grid gap-5 sm:grid-cols-2"
        >
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="topic">Enquiry about</Label>
            <Select value={topicValue} onValueChange={setTopicValue} name="topic">
              <SelectTrigger id="topic" className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-80">
                <SelectItem value={topics.general.value}>{topics.general.label}</SelectItem>
                {topics.groups.map((g) => (
                  <SelectGroup key={g.label}>
                    <SelectSeparator />
                    <SelectLabel>{g.label}</SelectLabel>
                    {g.items.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">
              Your name <span className="text-destructive">*</span>
            </Label>
            <Input id="name" name="name" required autoComplete="name" className="h-11" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" autoComplete="organization" className="h-11" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input id="email" name="email" type="email" required autoComplete="email" className="h-11" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" className="h-11" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="quantity">Quantity / specification</Label>
            <Input id="quantity" name="quantity" placeholder="e.g. 12 units, 630 A, 52 kV" className="h-11" />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="message">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={6}
              maxLength={MESSAGE_MAX}
              placeholder="Tell us what you need — models, ratings, delivery location and timeline."
            />
          </div>

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Sends from your own email app to <span className="font-medium">{topic.email}</span>.
            </p>
            <Button type="submit" size="lg">
              <Send /> Compose enquiry
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
