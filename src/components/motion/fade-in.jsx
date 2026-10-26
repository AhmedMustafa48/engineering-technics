import { cn } from "@/lib/utils";

// Server-safe entry animation for above-the-fold content (see `animate-rise`).
export function FadeIn({ as: Tag = "div", delay = 0, className, style, children, ...rest }) {
  return (
    <Tag {...rest} className={cn("animate-rise", className)} style={{ animationDelay: `${delay}s`, ...style }}>
      {children}
    </Tag>
  );
}
