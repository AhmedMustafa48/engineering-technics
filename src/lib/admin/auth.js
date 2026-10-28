import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Returns the signed-in admin or redirects to the login page. Call at the top of every admin page/action.
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/admin/login");
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data?.user) redirect("/admin/login");
  const { data: row } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!row) redirect("/admin/login?error=not-admin");
  return data.user;
}
