/* ================= CMS (data carried over from the previous gg site) =================
   Bundled snapshot (cms-data.json) paints first; the live row in Supabase `cms_settings` (id 1) is merged over it.
   Credentials come from the NEXT_PUBLIC_SUPABASE_* env vars already set on Vercel. */
import snapshot from './cms-data.json';

const URL_ = import.meta.env.NEXT_PUBLIC_SUPABASE_URL, KEY = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function merge(base, over) {
  const out = { ...base };
  for (const k in over || {}) out[k] = over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) ? merge(base?.[k] || {}, over[k]) : over[k];
  return out;
}

export async function loadCMS() {
  if (!URL_ || !KEY) return snapshot;
  try {
    const r = await fetch(`${URL_}/rest/v1/cms_settings?id=eq.1&select=data`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    if (!r.ok) return snapshot;
    const rows = await r.json();
    return merge(snapshot, rows[0]?.data);
  } catch { return snapshot; }
}

/* clients come as plain strings or {name, image} */
export const clientsOf = cms => (cms.ggProductions?.clients || []).map(c => typeof c === 'string' ? { n: c, logo: '' } : { n: c.name, logo: c.image || '' });
