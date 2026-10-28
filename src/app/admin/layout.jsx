import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  let signedIn = false;
  if (isSupabaseConfigured) {
    const supabase = await createSessionClient();
    signedIn = Boolean((await supabase.auth.getUser()).data?.user);
  }
  return (
    <div className="min-h-dvh bg-muted/30">
      {signedIn && (
        <header className="border-b bg-background">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
            <Link href="/admin" className="font-semibold">
              ET Admin
            </Link>
            <nav className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/admin" className="hover:text-foreground">Products</Link>
              <Link href="/admin/brands" className="hover:text-foreground">Suppliers</Link>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/" target="_blank">
                  <ExternalLink /> View site
                </Link>
              </Button>
              <form action={logout}>
                <Button variant="outline" size="sm">
                  <LogOut /> Sign out
                </Button>
              </form>
            </div>
          </div>
        </header>
      )}
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
