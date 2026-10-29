// Rebuilds src/content/page-texts.json: every editable piece of static text on the page, in page order.
// Run `npm run texts` after changing the page markup (src/app/(site)/markup.ts).
import fs from 'fs';
import { walk } from '../src/content/pageTextRules.js';

const src = fs.readFileSync(new URL('../src/app/(site)/markup.ts', import.meta.url), 'utf8');
const html = JSON.parse(src.match(/const markup = (".*");\nexport default markup;/s)[1]);
const out = [], seen = new Set();
walk(html, (_node, e) => { if (!seen.has(e.key)) { seen.add(e.key); out.push(e); } });
fs.writeFileSync(new URL('../src/content/page-texts.json', import.meta.url), JSON.stringify(out, null, 1));
const groups = {}; out.forEach(e => (groups[e.group] = (groups[e.group] || 0) + 1));
console.log(out.length + ' editable texts', groups);
