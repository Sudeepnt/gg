/* Shared by scripts/extract-page-texts.mjs and the site: which text on the page is editable from the "Page text" tab,
   and how each piece is identified (section + its original wording). Text that other tabs already control, or that the
   page builds itself with JavaScript, is left out so there is never a second, conflicting editor for the same words. */
import { parse } from 'node-html-parser';

export const EXCLUDE = ['#gl', '#svc', '#spx', '#jobs', '#cli', '#ldr', '#fmlist', '#msgbody', '.vals', '.mvv .v', '.mvv .lead', '#doc', '.msg > .big', '#kvcatch', '.kv-sub',
  '#kvlb', '#kvpk', '#csub', '#tn', 'button[data-open]', '#kvsb', '#kvhud', '#shot', '#clk', '#pitch', '#mail', '.wbar', '#dpbody', '#dpbc', '#mstat', '#mnav', '#mdoc', '.fsm > div:first-child', '#ctsub', '#cttabs', '#toast', '#slotv', '#slotn',
  '#rsec', '#rno', '#pka', '#pkt', '#nl', '.sc', '#ptc', '.kv-th', '#kvsegs', '#kvn', '#kvtot', '#kvtc', '#kvstate', '#ldn', '#bios', '#panelContact', '.mail',
  /* retired: the boot screen was removed, and the old hero montage's coordinates, clock and canvas label are hidden behind the stories carousel */
  '#ld', '.kv-meta', '#kv', '#stpk',
  /* the sample showreel's own button and note are never shown (the real reel always plays), and the menu's company name and email follow Contact -> Footer and contact details */
  '#play', '.mon + .note', '.fm .side .blk:nth-child(1) h4', '.fm .side .blk:nth-child(2) p'];
/* only wording a visitor can see: tooltips, hints inside boxes and each section's name (its thin top bar, the side rail and the top bar). Screen-reader labels and image descriptions are not editable. */
const ATTRS = [['title', 'Tooltip'], ['placeholder', 'Hint inside the box'], ['data-name', 'Section name (shown in the thin bar at the top of the section, the side rail and the top bar)']];
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
/* what the visitor would call this piece of text: a heading, a button, a filter button... (shown above its box in the admin) */
function labelOf(node, group) {
  const up = []; for (let n = node.parentNode, i = 0; n && i < 4; n = n.parentNode, i++) up.push(n);
  const has = (n, c) => !!n?.classList?.contains(c);
  const btn = up.find(n => n.tagName === 'A' || n.tagName === 'BUTTON');
  if (btn && !/^(P|H[1-4])$/.test(up[0]?.tagName)) {   /* a heading or paragraph inside a clickable card is still a heading or paragraph */
    if (has(btn, 'tab')) return 'Filter button';
    if (has(btn.parentNode, 'mode')) return 'View switch button';
    if (has(btn.parentNode, 'seg')) return 'Reel switch button';
    if (btn.getAttribute('id') === 'mbtn') return 'Menu button';
    if (group === 'Footer' && btn.tagName === 'A') return 'Link';
    if (group === 'Header' && btn.tagName === 'A' && !has(btn, 'hd-ct')) return 'Navigation link';
    return 'Button';
  }
  const p = up[0], tag = p?.tagName;
  if (tag === 'H1' || tag === 'H2' || tag === 'H3') return 'Heading';
  if (tag === 'H4') return 'Small heading';
  if (tag === 'LABEL' || tag === 'TH') return 'Label';
  if (tag === 'LI') return 'List item';
  if (tag === 'TD') return 'Value';
  if (has(p, 'sub')) return 'Sub-heading';
  if (has(p, 'lead')) return 'Introduction';
  if (has(p, 'pn-k')) return 'Small label above the heading';
  if (has(p, 'note')) return 'Note';
  if (has(p, 'cap')) return 'Caption';
  if (has(p, 'big')) return 'Big line';
  if (has(p, 's')) return 'Step label';
  if (has(p, 'sig')) return 'Signature line';
  if (tag === 'P') return 'Paragraph';
  if (tag === 'B') return 'Bold label';
  if (tag === 'SMALL') return 'Small text';
  return 'Text';
}

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
        visit(ch, { key: `${group}::${text}`, group, label: labelOf(ch, group), text });
      }
    }
  };
  go(root);
  /* second pass: wording that is not on screen but is read out or shown as a tooltip / placeholder / section name.
     Collected first and applied after, so a renamed section never changes the group (and key) of the entries inside it. */
  /* attributes the script rewrites itself are edited under "All other text" (uiStrings.js) or their own tab, never twice */
  const ATTR_SKIP = new Set();
  ['#kvpp', '#panelContact', '#pitch', '#toast', '#kv', '#kvsegs', '#stpk', '#reel'].forEach(sel => { try { root.querySelectorAll(sel).forEach(e => { ATTR_SKIP.add(e); e.querySelectorAll('*').forEach(c => ATTR_SKIP.add(c)); }); } catch { /* ignore */ } });
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
