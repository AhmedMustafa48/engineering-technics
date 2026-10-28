"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Long descriptions collapse to a few lines with a "Show more / Show less" toggle.
// The full text is always in the HTML, so search engines still read all of it.
export function ClampText({ text, limit = 170, className }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  const long = text.length > limit;
  return (
    <div className={className}>
      <p className={cn("whitespace-pre-line text-sm leading-relaxed text-muted-foreground", long && !open && "line-clamp-3")}>{text}</p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded"
        >
          {open ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
