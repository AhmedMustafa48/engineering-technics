"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

// Cycles through categories as a live, clickable link. Pauses while hovered.
export function RotatingCategory({ items, interval = 2400 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    return () => clearInterval(id);
  }, [paused, items.length, interval]);

  const item = items[index];

  return (
    <span
      className="relative inline-flex h-[1.6em] overflow-hidden align-bottom"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={item.slug}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          <Link
            href={`/products/${item.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-cyan-300 underline decoration-cyan-300/30 underline-offset-4 hover:decoration-cyan-300"
          >
            {item.name}
            <ArrowUpRight className="size-4" />
          </Link>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
