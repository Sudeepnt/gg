/* Shared by scripts/extract-page-texts.mjs and the site: which text on the page is editable from the "Page text" tab,
   and how each piece is identified (section + its original wording). Text that other tabs already control, or that the
   page builds itself with JavaScript, is left out so there is never a second, conflicting editor for the same words. */
import { parse } from 'node-html-parser';

export const EXCLUDE = ['#gl', '#svc', '#spx', '#jobs', '#cli', '#ldr', '#fmlist', '#msgbody', '.vals', '.mvv .v', '.mvv .lead', '#doc', '.msg > .big', '#kvcatch', '.kv-sub',
  '#kvlb', '#kvpk', '#csub', '#tn', 'button[data-open]', '#kvsb', '#kvhud', '#shot', '#clk', '#pitch', '#mail', '.wbar', '#dpbody', '#dpbc', '#mstat', '#mnav', '#mdoc', '.fsm > div:first-child', '#ctsub', '#cttabs', '#toast', '#slotv', '#slotn',
  '#rsec', '#rno', '#pka', '#pkt', '#nl', '.sc', '#ptc', '.kv-th', '#kvsegs', '#kvn', '#kvtot', '#kvtc', '#kvstate', '#ldn', '#bios', '#panelContact', '.mail'];
const ATTRS = [['aria-label', 'Screen-reader label'], ['title', 'Tooltip'], ['placeholder', 'Hint inside the box'], ['alt', 'Image description'], ['data-name', 'Section name (window bar and side rail)']];
const SKIP_TAGS = new Set(['script', 'style', 'svg', 'canvas', 'noscript', 'textarea', 'option', 'select']);
export const norm = t => String(t).replace(/\s+/g, ' ').trim();
const titleCase = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).replace(/\bGg\b/, 'GG');

function groupOf(node) {
  for (let n = node.parentNode; n; n = n.parentNode) {
    if (n.tagName === 'SECTION' && n.getAttribute?.('data-name')) return titleCase(n.getAttribute('data-name'));
    if (n.getAttribute?.('id') === 'fm') return 'Menu';
    if (n.getAttribute?.('id') === 'modal') return 'Network roster window';
    if (n.getAttribute?.('id') === 'machine') return 'Machine view';
    if (n.getAttribute?.('id') === 'ld') return 'Loading screen';
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
  /* second pass: wording that is not on screen but is read out or shown as a tooltip / placeholder / section name.
     Collected first and applied after, so a renamed section never changes the group (and key) of the entries inside it. */
  /* attributes the script rewrites itself are edited under "All other text" (uiStrings.js) or their own tab, never twice */
  const ATTR_SKIP = new Set();
  ['#kvpp', '#panelContact', '#pitch', '#toast'].forEach(sel => { try { root.querySelectorAll(sel).forEach(e => { ATTR_SKIP.add(e); e.querySelectorAll('*').forEach(c => ATTR_SKIP.add(c)); }); } catch { /* ignore */ } });
  const found = [];
  const walkEls = node => {
    for (const ch of node.childNodes) {
      if (ch.nodeType !== 1) continue;
      if (ATTR_SKIP.has(ch)) continue;
      for (const [attr, label] of ATTRS) {
        const v = ch.getAttribute?.(attr);
        const text = v == null ? '' : norm(v);
        if (text.length < 2 || !/[A-Za-z]/.test(text)) continue;
        if (attr === 'data-name' && ch.tagName !== 'SECTION') continue;
        const group = attr === 'data-name' ? titleCase(text) : groupOf(ch);
        found.push([ch, { key: `${group}::[${attr}] ${text}`, group, label, text, attr }]);
      }
      if (!['script', 'style'].includes(ch.tagName?.toLowerCase())) walkEls(ch);
    }
  };
  walkEls(root);
  found.forEach(([el, info]) => visit(el, info));
  return root;
}

/* server-side: returns the markup with the edited wording applied (untouched when there are no edits) */
export function applyTexts(html, overrides) {
  if (!overrides || !Object.keys(overrides).length) return html;
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const root = walk(html, (node, { key, attr }) => {
    const v = overrides[key];
    if (typeof v === 'string' && v.trim()) {
      if (attr) { node.setAttribute(attr, v.trim()); return; }
      const raw = node.rawText, lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
      node.rawText = lead + esc(v.trim()) + trail;
    }
  });
  return root.toString();
}
