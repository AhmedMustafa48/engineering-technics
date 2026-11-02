"use client";

import Link from "next/link";
import { ArrowRight, LogOut } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/admin/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/items", label: "Items" },
  { href: "/admin/brands", label: "Suppliers" },
];

export function AdminHeader() {
  return (
    <SiteHeader
      nav={NAV}
      logoHref="/admin"
      actions={
        <>
          <form action={logout} className="hidden sm:block">
            <Button variant="ghost" size="sm">
              <LogOut /> Sign out
            </Button>
          </form>
          <Button asChild size="sm" variant="brand" className="hidden sm:inline-flex">
            <Link href="/" target="_blank">
              View site <ArrowRight />
            </Link>
          </Button>
        </>
      }
      mobileActions={
        <div className="mt-6 space-y-3">
          <Button asChild variant="brand" size="lg" className="w-full">
            <Link href="/" target="_blank">
              View site <ArrowRight />
            </Link>
          </Button>
          <form action={logout}>
            <Button variant="outline" size="lg" className="w-full">
              <LogOut /> Sign out
            </Button>
          </form>
        </div>
      }
    />
  );
}
