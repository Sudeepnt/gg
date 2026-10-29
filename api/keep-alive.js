// Vercel cron (see vercel.json): logs a heartbeat row so the free Supabase project does not pause.
export default async function handler(req, res) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res.status(500).json({ success: false, error: 'Supabase env vars missing' });
  try {
    const r = await fetch(`${url}/rest/v1/project_heartbeat`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ message: 'hi' })
    });
    if (!r.ok) return res.status(500).json({ success: false, error: await r.text() });
    return res.status(200).json({ success: true });
  } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
}
