"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

// Initial theme is applied before paint by the inline script in the root layout
// (see THEME_SCRIPT), so this only has to flip the class and persist the choice.
export function ThemeToggle() {
  function toggle() {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme-v2", next);
    } catch {}
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle colour theme">
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  );
}

export const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme-v2");var d=t==="dark";document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;
