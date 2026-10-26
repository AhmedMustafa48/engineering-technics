import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label="Engineering Technics — home">
      <span
        aria-hidden
        className="grid size-8 place-items-center rounded-md bg-primary text-[13px] font-bold tracking-tighter text-primary-foreground transition-transform group-hover:-rotate-6"
      >
        ET
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight">Engineering Technics</span>
        <span className="mt-0.5 text-[11px] text-muted-foreground">Lahore · Pakistan</span>
      </span>
    </Link>
  );
}
