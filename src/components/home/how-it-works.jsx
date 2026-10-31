"use client";

import { motion } from "motion/react";
import { FileSearch, MailCheck, Handshake } from "lucide-react";
import { IconTile } from "@/components/site/icon-tile";
import { accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: FileSearch,
    title: "Find the part",
    body: "Browse by product and item, or flip through the full catalogue online.",
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

// Sits on a navy panel: glass cards, each with its own accent colour.
export function HowItWorks() {
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {steps.map(({ icon, title, body }, i) => (
        <motion.li
          key={title}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.15 }}
        >
          <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", accent(i).tile)} />
          <span aria-hidden className="absolute right-5 top-3 text-7xl font-bold text-white/10">
            {i + 1}
          </span>
          <IconTile icon={icon} index={i} className="size-14 rounded-2xl" iconClassName="size-6" />
          <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 leading-relaxed text-white/70">{body}</p>
        </motion.li>
      ))}
    </ol>
  );
}
