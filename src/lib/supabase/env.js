export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Without these the site falls back to the static catalogue in src/data, so it still runs locally.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
