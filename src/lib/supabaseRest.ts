import "server-only";

/* Minimal server-side Supabase (PostgREST) client. No SDK needed.
   Key priority: SUPABASE_SERVICE_ROLE_KEY (server only, bypasses RLS) -> NEXT_PUBLIC_SUPABASE_ANON_KEY -> NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. */
export function sbConfig() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return { url, key, headers: { apikey: key, Authorization: `Bearer ${key}` } as Record<string, string> };
}
