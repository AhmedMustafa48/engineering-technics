import { CategoryIcon } from "@/components/catalog/category-icon";
import { cn } from "@/lib/utils";

// Shown when there is no photo: branded, on-grid, clearly intentional.
export function ImagePlaceholder({ icon = "Package", className }) {
  return (
    <div className={cn("relative grid h-full place-items-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100", className)}>
      <div aria-hidden className="bg-grid absolute inset-0 [--grid-line:rgb(15_23_42/0.06)] [--grid-size:24px]" />
      <div className="relative flex flex-col items-center gap-3 text-slate-400">
        <span className="grid size-14 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <CategoryIcon name={icon} className="size-7 text-slate-500" />
        </span>
        <span className="text-xs font-medium">Image on request</span>
      </div>
    </div>
  );
}
