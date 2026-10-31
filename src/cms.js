/* Content loader. All editable content now comes from src/content/site-content.json (embedded in the page as
   #gg-content and edited from /admingg). Nothing is read from Supabase. The bundled snapshot (cms-data.json) only
   supplies the default wording of the Pitch us intro and the application form. */
import snapshot from './cms-data.json';

function merge(base, over) {
  const out = { ...base };
  for (const k in over || {}) out[k] = over[k] && typeof over[k] === 'object' && !Array.isArray(over[k]) ? merge(base?.[k] || {}, over[k]) : over[k];
  return out;
}

export function siteContent() {
  try { return JSON.parse(document.getElementById('gg-content').textContent); } catch { return null; }
}

export async function loadCMS() {
  const c = siteContent();
  if (!c) return snapshot;
  return merge(snapshot, {
    home: { playReelVideo: c.reels?.main || '', playReelVideo2: c.reels?.second || '' },
    ggProductions: { clients: (c.clients || []).map(x => ({ name: x.name, image: x.logo })) },
    pitch: { title: c.pitch?.title, paragraphs: c.pitch?.paragraphs, buttonText: c.pitch?.buttonText },
    contact: { email: c.contact?.email },
    form: c.applicationForm ? { title: c.applicationForm.title, intro: c.applicationForm.intro, labels: c.applicationForm.labels } : undefined,
  });
}

/* clients come as plain strings or {name, image} */
export const clientsOf = cms => (cms.ggProductions?.clients || []).map(c => typeof c === 'string' ? { n: c, logo: '' } : { n: c.name, logo: c.image || '' });
