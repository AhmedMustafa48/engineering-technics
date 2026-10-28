"use client";

import { usePathname } from "next/navigation";

// The public site chrome (header, CTA, footer) is hidden on the /admin area.
export function ChromeGate({ top, bottom, children }) {
  const isAdmin = usePathname().startsWith("/admin");
  return (
    <>
      {!isAdmin && top}
      <main id="main" className="flex-1">
        {children}
      </main>
      {!isAdmin && bottom}
    </>
  );
}
