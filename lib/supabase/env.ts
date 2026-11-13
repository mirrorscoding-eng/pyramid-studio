/**
 * Prototype mode: without Supabase keys the site still runs, using the built-in
 * content (lib/content/defaults.json). The dashboard and the contact form need Supabase.
 */
export const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
