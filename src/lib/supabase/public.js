import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./env";

// Anonymous, cookie-free client for public catalogue reads. RLS only exposes published products,
// and because it never touches cookies it is safe inside cached (unstable_cache) functions.
export function createPublicClient() {
  return createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
