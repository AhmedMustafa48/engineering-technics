import { CheckCircle2, TriangleAlert } from "lucide-react";
import { HeroBackdrop } from "@/components/effects/hero-backdrop";
import { IconTile } from "@/components/site/icon-tile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { heroImages } from "@/lib/hero-photo";
import { cn } from "@/lib/utils";

export const selectClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

// Page frame for the admin area: the landing page's photo banner above the content.
export function AdminPage({ eyebrow, title, description, image = "products", action, children }) {
  return (
    <>
      <section className="relative isolate overflow-hidden text-white">
        <HeroBackdrop image={heroImages[image] ?? heroImages.products} />
        <div className="container-page relative flex flex-wrap items-end justify-between gap-5 py-10 drop-shadow-[0_2px_10px_rgb(0_0_0/0.6)] sm:py-12">
          <div className="min-w-0">
            {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p>}
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
            {description && <p className="mt-2 max-w-2xl text-white/85">{description}</p>}
          </div>
          {action && <div className="flex flex-wrap gap-2">{action}</div>}
        </div>
      </section>
      <div className="container-page py-8">{children}</div>
    </>
  );
}

export function Notice({ tone = "success", children }) {
  const Icon = tone === "success" ? CheckCircle2 : TriangleAlert;
  return (
    <p
      role={tone === "success" ? "status" : "alert"}
      className={cn(
        "mb-5 flex items-start gap-2.5 rounded-xl p-3 text-sm",
        tone === "success" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-destructive/10 text-destructive",
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  );
}

export function Field({ label, hint, htmlFor, required, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span aria-hidden className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// Filled in from the name until the admin types their own.
export function SlugField({ value, onChange, hint }) {
  return (
    <Field label="URL slug" htmlFor="slug" required hint={hint}>
      <Input id="slug" name="slug" required value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function FormCard({ icon, index = 0, title, hint, children }) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <IconTile icon={icon} index={index} />
        <div>
          <h2 className="font-semibold">{title}</h2>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

// Keeps the save button in reach on long forms.
export function SaveBar({ error, children }) {
  return (
    <div className="sticky bottom-3 z-10 space-y-2 rounded-2xl border bg-card/90 p-3 shadow-lg backdrop-blur">
      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 p-2.5 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}
