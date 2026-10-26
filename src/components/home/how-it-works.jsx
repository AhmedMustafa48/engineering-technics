"use client";

import { motion } from "motion/react";
import { FileSearch, MailCheck, Handshake } from "lucide-react";

const steps = [
  {
    icon: FileSearch,
    title: "Find the part",
    body: "Search by product, model number or spec — or flip through the full catalogue online.",
  },
  {
    icon: MailCheck,
    title: "Send one enquiry",
    body: "Every product page has a pre-filled email and call button. Add quantities and ratings.",
  },
  {
    icon: Handshake,
    title: "We work with the maker",
    body: "We come back with specifications, pricing and lead times from the manufacturer.",
  },
];

const ease = [0.22, 1, 0.36, 1];

export function HowItWorks() {
  return (
    <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
      {/* Connector line draws itself across the three steps. */}
      <motion.span
        aria-hidden
        className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px origin-left bg-gradient-to-r from-brand via-primary/40 to-brand md:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, ease, delay: 0.2 }}
      />
      {steps.map(({ icon: Icon, title, body }, i) => (
        <motion.li
          key={title}
          className="relative flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease, delay: 0.15 + i * 0.2 }}
        >
          <span className="relative grid size-14 place-items-center rounded-2xl border bg-card shadow-sm">
            <Icon className="size-6 text-brand" />
            <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {i + 1}
            </span>
          </span>
          <h3 className="mt-5 text-lg font-semibold">{title}</h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{body}</p>
        </motion.li>
      ))}
    </ol>
  );
}
