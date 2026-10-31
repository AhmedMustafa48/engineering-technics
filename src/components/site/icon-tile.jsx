import { accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

// Gradient icon square, the one icon treatment for cards and lists across the site.
export function IconTile({ icon: Icon, index = 0, className, iconClassName }) {
  return (
    <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-md", accent(index).tile, className)}>
      <Icon aria-hidden className={cn("size-5", iconClassName)} />
    </span>
  );
}
