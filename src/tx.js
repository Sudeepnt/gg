/* Wording the page's scripts build themselves (pop-ups, loading lines, reel labels, Machine view): edits live in the site content
   under uiText, keyed by the original text, and are made in /admingg → All other text. Short texts match whole; longer ones are
   replaced wherever they appear inside a line. The list of editable texts is src/content/uiStrings.js. */
let UT = {};
try { UT = (JSON.parse(document.getElementById('gg-content').textContent) || {}).uiText || {}; } catch { UT = {}; }
const KEYS = Object.keys(UT).filter(k => k.length >= 12 && typeof UT[k] === 'string' && UT[k].trim() && UT[k] !== k).sort((a, b) => b.length - a.length);
export const tx = t => {
  if (typeof t !== 'string') return t;
  const w = UT[t];
  if (typeof w === 'string' && w.trim()) return w;
  let o = t;
  for (const k of KEYS) if (o.includes(k)) o = o.split(k).join(UT[k]);
  return o;
};
