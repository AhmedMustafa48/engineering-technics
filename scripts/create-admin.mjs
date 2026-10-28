// Creates (or promotes) an admin user.
// Usage: node --env-file=.env.local scripts/create-admin.mjs you@example.com 'a-strong-password'
import { createClient } from "@supabase/supabase-js";

const [email, password] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!email || !password || !url || !key) throw new Error("Usage: create-admin.mjs <email> <password> (with Supabase env set)");

const db = createClient(url, key, { auth: { persistSession: false } });

let userId;
const created = await db.auth.admin.createUser({ email, password, email_confirm: true });
if (created.error) {
  // Already registered: look the user up instead.
  const { data, error } = await db.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;
  userId = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
  if (!userId) throw created.error;
} else {
  userId = created.data.user.id;
}

const { error } = await db.from("admins").upsert({ user_id: userId });
if (error) throw error;
console.log(`✓ ${email} is an admin. Sign in at /admin/login`);
