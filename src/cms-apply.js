/* Applies the carried-over gg CMS data to the page: client logos, the reel video and the contact email. */
import { loadCMS, clientsOf } from './cms.js';

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function applyClients(list) {
  const wrap = $('#cli'), cta = wrap && wrap.querySelector('.cl.cta');
  if (!wrap || !cta || !list.length) return;
  cta.querySelector('.ix').textContent = String(list.length + 1).padStart(2, '0');
  wrap.querySelectorAll('.cl:not(.cta)').forEach(n => n.remove());
  list.forEach((c, i) => cta.insertAdjacentHTML('beforebegin',
    `<div class="cl"><span class="ix">${String(i + 1).padStart(2, '0')}</span>${c.logo ? `<img src="${esc(c.logo)}" alt="${esc(c.n)}">` : `<span class="wm">${esc(c.n)}</span>`}<span class="ty">Client</span></div>`));
}

function applyReel(url) {
  const scr = $('#reel')?.closest('.scr');
  if (!scr || !url || scr.querySelector('video')) return;
  const v = document.createElement('video');
  Object.assign(v, { src: url, controls: true, playsInline: true, preload: 'none' });
  v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000;display:none;filter:grayscale(1)';
  scr.appendChild(v);
  /* capture phase so the canvas mock's own play handler never runs */
  scr.addEventListener('click', e => {
    if (!e.target.closest('#play') && e.target !== v) return;
    if (e.target === v) return;
    e.stopPropagation();
    $('#play').hidden = true; $('#reel').style.display = 'none'; v.style.display = 'block'; v.play().catch(() => {});
  }, true);
}

function applyContact(email) {
  if (!email) return;
  const mail = $('#mail'); if (mail) mail.textContent = email;
}

loadCMS().then(cms => {
  applyClients(clientsOf(cms));
  applyReel(cms.home?.playReelVideo);
  applyContact(cms.contact?.email || cms.home?.socials?.email);
});
