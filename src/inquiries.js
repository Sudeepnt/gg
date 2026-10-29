/* Saves form submissions to the same Supabase project the previous site used:
   table `inquiries` (name, email, message, data jsonb) and storage bucket `gg-content` (applications/…).
   Credentials come from the NEXT_PUBLIC_SUPABASE_* env vars already set on Vercel. */
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL, KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const auth = () => ({ apikey: KEY, Authorization: `Bearer ${KEY}` });
export const configured = () => !!(URL_ && KEY);

export async function uploadFile(file) {
  const path = `applications/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const r = await fetch(`${URL_}/storage/v1/object/gg-content/${encodeURI(path)}`, {
    method: 'POST', headers: { ...auth(), 'Content-Type': file.type || 'application/octet-stream' }, body: file,
  });
  if (!r.ok) throw new Error(`Upload failed (${r.status})`);
  return { name: file.name, url: `${URL_}/storage/v1/object/public/gg-content/${encodeURI(path)}` };
}

/* same row shape as the old saveInquiry(): data holds the whole payload */
export async function saveInquiry(inquiry) {
  if (!configured()) throw new Error('Form storage is not configured');
  const r = await fetch(`${URL_}/rest/v1/inquiries`, {
    method: 'POST',
    headers: { ...auth(), 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify([{ name: inquiry.name, email: inquiry.email, message: inquiry.message, data: inquiry }]),
  });
  if (!r.ok) throw new Error((await r.text()) || `Save failed (${r.status})`);
}

/* used by the Contact form in app.js */
window.__ggSave = async (kind, d) => {
  try {
    await saveInquiry({ name: d.name, email: d.email, message: d.message, kind, inquiryType: d.type_label, company: d.company });
    return { ok: true };
  } catch (e) { console.error('Inquiry save failed:', e); return { ok: false }; }
};
