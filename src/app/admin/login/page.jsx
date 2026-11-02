import { LoginForm } from "@/components/admin/login-form";
import { Notice } from "@/components/admin/admin-ui";
import { HeroBackdrop } from "@/components/effects/hero-backdrop";
import { Logo } from "@/components/site/logo";
import { company } from "@/data/company";
import { heroImages } from "@/lib/hero-photo";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }) {
  const { error } = await searchParams;
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative isolate hidden flex-col justify-center overflow-hidden p-12 text-white lg:flex">
        <HeroBackdrop image={heroImages.products} />
        <div className="relative drop-shadow-[0_2px_10px_rgb(0_0_0/0.6)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Admin panel</p>
          <p className="mt-3 max-w-md text-4xl font-extrabold leading-tight tracking-tight">{company.slogan}</p>
        </div>
      </aside>
      <div className="grid place-items-center p-6">
        <div className="w-full max-w-sm">
          <Logo />
          <h1 className="mt-8 text-3xl font-bold">
            Admin <span className="text-gradient">sign in</span>
          </h1>
          <p className="mt-2 mb-6 text-sm text-muted-foreground">Manage categories, items and suppliers.</p>
          {!isSupabaseConfigured && (
            <Notice tone="error">Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.</Notice>
          )}
          {error === "not-admin" && <Notice tone="error">This account is not an admin. Add its user id to the admins table.</Notice>}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
