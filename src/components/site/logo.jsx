import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-2.5", className)} aria-label="Engineering Technics — home">
      <Image
        src="/logo/logo.png"
        alt=""
        width={900}
        height={446}
        priority
        className="h-9 w-auto transition-transform group-hover:-rotate-3"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight">Engineering Technics</span>
        <span className="mt-0.5 text-[11px] text-muted-foreground">Lahore · Pakistan</span>
      </span>
    </Link>
  );
}
