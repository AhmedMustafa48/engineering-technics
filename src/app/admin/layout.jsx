import { AdminHeader } from "@/components/admin/admin-header";
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
    <div className="min-h-dvh bg-background">
      {signedIn && <AdminHeader />}
      {children}
    </div>
  );
}
