/* Shared by scripts/extract-page-texts.mjs and the site: which text on the page is editable from the "Page text" tab,
   and how each piece is identified (section + its original wording). Text that other tabs already control, or that the
   page builds itself with JavaScript, is left out so there is never a second, conflicting editor for the same words. */
import { parse } from 'node-html-parser';

export const EXCLUDE = ['#gl', '#svc', '#spx', '#jobs', '#cli', '#ldr', '#fmlist', '#msgbody', '.vals', '.mvv .v', '.mvv .lead', '#doc', '.msg > .big', '#kvcatch', '.kv-sub',
  '#kvlb', '#kvpk', '#csub', '#tn', 'button[data-open]', '#kvsb', '#kvhud', '#shot', '#clk', '#pitch', '#mail', '.wbar', '#dpbody', '#dpbc', '#machine', '.fsm > div:first-child', '#ctsub', '#cttabs', '#toast', '#slotv', '#slotn',
  '#rsec', '#rno', '#pka', '#pkt', '#ld', '#nl', '.sc', '#ptc', '.kv-th', '#kvsegs', '#kvn', '#kvtot', '#kvtc', '#kvstate', '#ldn', '#bios', '#panelContact', '.mail'];
const SKIP_TAGS = new Set(['script', 'style', 'svg', 'canvas', 'noscript', 'textarea', 'option', 'select']);
export const norm = t => String(t).replace(/\s+/g, ' ').trim();
const titleCase = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace(/\bGg\b/, 'GG');

function groupOf(node) {
  for (let n = node.parentNode; n; n = n.parentNode) {
    if (n.tagName === 'SECTION' && n.getAttribute?.('data-name')) return titleCase(n.getAttribute('data-name'));
    if (n.getAttribute?.('id') === 'fm') return 'Menu';
    if (n.getAttribute?.('id') === 'modal') return 'Network roster window';
    if (n.tagName === 'HEADER' && n.classList?.contains('hd')) return 'Header';
    if (n.tagName === 'FOOTER') return 'Footer';
  }
  return 'Other';
}
const labelOf = tag => ({ H1: 'Heading', H2: 'Heading', H3: 'Heading', H4: 'Heading', P: 'Paragraph', A: 'Link / button', BUTTON: 'Link / button', LABEL: 'Label', LI: 'List item', TH: 'Label', TD: 'Value', SMALL: 'Small text', B: 'Bold text' }[tag] || 'Text');

/* walk every editable text node: calls visit(node, {key, group, label, text}) */
export function walk(html, visit) {
  const root = parse(html, { comment: true });
  const skip = new Set();
  EXCLUDE.forEach(sel => { try { root.querySelectorAll(sel).forEach(e => skip.add(e)); } catch { /* selector not supported: ignore */ } });
  const go = node => {
    for (const ch of node.childNodes) {
      if (ch.nodeType === 1) {
        if (SKIP_TAGS.has(ch.tagName?.toLowerCase()) || skip.has(ch)) continue;
        go(ch);
      } else if (ch.nodeType === 3) {
        const text = norm(ch.text);
        if (text.length < 2 || !/[A-Za-z]/.test(text)) continue;
        const group = groupOf(ch);
        visit(ch, { key: `${group}::${text}`, group, label: labelOf(ch.parentNode?.tagName), text });
      }
    }
  };
  go(root);
  return root;
}

/* server-side: returns the markup with the edited wording applied (untouched when there are no edits) */
export function applyTexts(html, overrides) {
  if (!overrides || !Object.keys(overrides).length) return html;
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const root = walk(html, (node, { key }) => {
    const v = overrides[key];
    if (typeof v === 'string' && v.trim()) {
      const raw = node.rawText, lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
      node.rawText = lead + esc(v.trim()) + trail;
    }
  });
  return root.toString();
}
