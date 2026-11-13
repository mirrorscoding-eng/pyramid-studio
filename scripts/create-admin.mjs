// Creates (or updates) the dashboard admin account and marks it as admin.
// Usage: npm run create-admin   (reads ADMIN_EMAIL / ADMIN_PASSWORD from .env.local)
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
const email = process.argv[2] || process.env.ADMIN_EMAIL;
const password = process.argv[3] || process.env.ADMIN_PASSWORD;

if (!url || !key || !email || !password) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_EMAIL or ADMIN_PASSWORD.');
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

let userId;
const { data: created, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
if (error) {
  const { data: list, error: listErr } = await sb.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) throw listErr;
  const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!existing) throw error;
  userId = existing.id;
  const { error: upErr } = await sb.auth.admin.updateUserById(userId, { password });
  if (upErr) throw upErr;
  console.log('Updated password for existing user', email);
} else {
  userId = created.user.id;
  console.log('Created user', email);
}

const { error: adminErr } = await sb.from('admins').upsert({ user_id: userId });
if (adminErr) throw adminErr;
console.log('Admin access granted ✦');
