import { PowerLines } from "@/components/effects/power-lines";
import { CountUp } from "@/components/home/count-up";
import { cn } from "@/lib/utils";

// The site's signature surface: deep navy, engineering grid, drifting glows and
// flowing power lines. Used by the home hero, every page header, product hero,
// closing CTA and 404, so all pages share one visual language.
export function BrandPanel({ as: Tag = "div", className, innerClassName, lines = true, glow = "left", children, ...rest }) {
  return (
    <Tag {...rest} className={cn("relative overflow-hidden rounded-[2rem] bg-[#0b1628] text-white", className)}>
      <div
        aria-hidden
        className="bg-grid absolute inset-0 [--grid-line:rgb(255_255_255/0.05)] [--grid-size:56px] [mask-image:radial-gradient(ellipse_at_30%_20%,black_30%,transparent_75%)]"
      />
      <div
        aria-hidden
        className={cn(
          "animate-drift absolute -top-40 size-[32rem] rounded-full bg-cyan-500/20 blur-3xl",
          glow === "left" ? "-left-32" : "-right-32",
        )}
      />
      <div
        aria-hidden
        className="animate-drift absolute -bottom-48 right-0 size-[36rem] rounded-full bg-blue-600/25 blur-3xl"
        style={{ animationDelay: "-7s" }}
      />
      {lines && <PowerLines className="absolute inset-x-0 bottom-0 h-40 w-full text-cyan-300/45" />}
      <div className={cn("relative", innerClassName)}>{children}</div>
    </Tag>
  );
}

// Big-number stats, as in the home hero. items: [[value, label], ...]
export function PanelStats({ items, className }) {
  return (
    <dl className={cn("grid auto-cols-max grid-flow-col gap-8 border-t border-white/10 pt-6 lg:border-t-0 lg:border-l lg:pl-10 lg:pt-0", className)}>
      {items.map(([value, label]) => (
        <div key={label}>
          <dt className="text-xs text-white/50">{label}</dt>
          <dd className="mt-1 text-3xl font-semibold tabular-nums">
            {typeof value === "number" ? <CountUp value={value} /> : value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// Text treatments that belong on the panel.
export const panelText = {
  eyebrow: "text-sm font-semibold uppercase tracking-wider text-cyan-300",
  body: "text-white/70",
  muted: "text-white/50",
};
