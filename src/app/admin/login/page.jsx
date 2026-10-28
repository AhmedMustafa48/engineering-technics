import { LoginForm } from "@/components/admin/login-form";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto mt-16 max-w-sm rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Admin sign in</h1>
      {!isSupabaseConfigured && (
        <p className="mt-3 rounded-md bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-300">
          Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY to .env.local.
        </p>
      )}
      {error === "not-admin" && (
        <p className="mt-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">This account is not an admin. Add its user id to the admins table.</p>
      )}
      <LoginForm />
    </div>
  );
}
