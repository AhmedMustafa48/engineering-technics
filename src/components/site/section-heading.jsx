import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

// Eyebrow + title (+ optional description and link): the one heading style for
// every content section on the site. `inverse` is for the navy panels.
export function SectionHeading({ eyebrow, title, description, href, linkLabel, id, center = false, inverse = false, as: Tag = "h2", className }) {
  return (
    <Reveal
      className={cn(
        center ? "mx-auto max-w-2xl text-center" : "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p
            className={cn(
              "inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
              inverse ? "bg-cyan-400/15 text-cyan-300" : "bg-brand-soft text-brand-foreground",
            )}
          >
            {eyebrow}
          </p>
        )}
        <Tag id={id} className={cn("text-2xl font-bold sm:text-4xl", eyebrow && "mt-3")}>
          {title}
        </Tag>
        {description && <p className={cn("mt-4 text-lg", inverse ? "text-white/70" : "text-muted-foreground")}>{description}</p>}
      </div>
      {href && (
        <Button asChild variant="ghost" className="group self-start sm:self-auto">
          <Link href={href}>
            {linkLabel} <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      )}
    </Reveal>
  );
}
