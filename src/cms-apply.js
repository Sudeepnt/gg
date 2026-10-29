/* Applies the carried-over gg CMS data to the page: client logos, the reel video and the contact email. */
import { loadCMS, clientsOf } from './cms.js';
import { tx } from './tx.js';

const $ = s => document.querySelector(s);

/* The CMS stores the original 33 MB 1080p upload on r2.dev, which is slow and uncached. For that known file we serve lean
   720p copies (index up front, so playback starts straight away) from the site itself; any other CMS URL is used as is. */
const LEAN = {
  '1774408082516-GG_Website_Showreel-(1)-(1).mp4': { full: '/reels/showreel-720.mp4', hero: '/reels/showreel-hero-720.mp4', poster: '/reels/showreel-poster.jpg' },
};
const lean = (url, kind) => { const k = url && Object.keys(LEAN).find(n => url.includes(n)); return k ? LEAN[k][kind] : (kind === 'poster' ? '' : url); };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function applyClients(list) {
  const wrap = $('#cli'), cta = wrap && wrap.querySelector('.cl.cta');
  if (!wrap || !cta || !list.length) return;
  cta.querySelector('.ix').textContent = String(list.length + 1).padStart(2, '0');
  wrap.querySelectorAll('.cl:not(.cta)').forEach(n => n.remove());
  list.forEach((c, i) => cta.insertAdjacentHTML('beforebegin',
    `<div class="cl"><span class="ix">${String(i + 1).padStart(2, '0')}</span>${c.logo ? `<img src="${esc(c.logo)}" alt="">` : ''}<span class="ty">${esc(c.n)}</span></div>`));
}

/* GG Productions monitor: "Animation" plays the main reel (same as the hero), "Art" plays the second CMS reel
   (home.playReelVideo2, falling back to the main one). No native controls and no full-screen view: it autoplays muted
   while on screen, with the old site's round play/pause and volume buttons plus a thin progress line as an overlay. */
const IC = {
  play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',
  pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  vol: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  mute: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>',
};
const svg = n => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

function applyReel(url, url2) {
  const canvas = $('#reel'), scr = canvas?.closest('.scr');
  if (!scr || !url || scr.querySelector('video')) return;
  const reels = { anim: lean(url, 'full'), art: lean(url2 || url, 'full') };
  const v = document.createElement('video');
  Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'metadata', poster: lean(url, 'poster') });
  v.className = 'rv-video';
  v.src = reels.anim;
  const ctl = document.createElement('div');
  ctl.className = 'rv-ctl';
  ctl.innerHTML = `<div class="rv-row"><button type="button" class="rv-btn" data-a="play" aria-label="${tx('Pause reel')}">${svg('pause')}</button><button type="button" class="rv-btn" data-a="mute" aria-label="${tx('Unmute reel')}">${svg('mute')}</button></div><div class="rv-bar" role="progressbar" aria-label="${tx('Reel progress')}"><i></i></div>`;
  scr.append(v, ctl);
  canvas.style.visibility = 'hidden';            /* keep its size so the monitor does not collapse */
  const play = $('#play'); if (play) play.style.display = 'none';
  const shot = $('#shot'); if (shot) shot.textContent = tx('GG Productions · Showreel');
  const note = scr.closest('.rv')?.querySelector('.note'); if (note) note.style.display = 'none';

  const bPlay = ctl.querySelector('[data-a=play]'), bMute = ctl.querySelector('[data-a=mute]'), fill = ctl.querySelector('.rv-bar i');
  let inView = false, userPaused = false;
  const sync = () => {
    const want = inView && !userPaused && !document.hidden;
    if (want && v.paused) v.play().catch(() => {}); else if (!want && !v.paused) v.pause();
  };
  const icons = () => { bPlay.innerHTML = svg(v.paused ? 'play' : 'pause'); bPlay.setAttribute('aria-label', v.paused ? tx('Play reel') : tx('Pause reel')); bMute.innerHTML = svg(v.muted ? 'mute' : 'vol'); bMute.setAttribute('aria-label', v.muted ? tx('Unmute reel') : tx('Mute reel')); };
  const toggle = () => { userPaused = !v.paused; if (v.paused) v.play().catch(() => {}); else v.pause(); };
  bPlay.onclick = e => { e.stopPropagation(); toggle(); };
  bMute.onclick = e => { e.stopPropagation(); v.muted = !v.muted; icons(); };
  v.addEventListener('click', toggle);
  ['play', 'pause', 'volumechange'].forEach(ev => v.addEventListener(ev, icons));
  v.addEventListener('timeupdate', () => { fill.style.width = (v.duration ? v.currentTime / v.duration * 100 : 0) + '%'; });
  ctl.querySelector('.rv-bar').addEventListener('click', e => { e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); if (v.duration) v.currentTime = (e.clientX - r.left) / r.width * v.duration; });
  document.querySelectorAll('.mon .seg button[data-r]').forEach(b => b.addEventListener('click', () => {
    const src = reels[b.dataset.r]; if (!src || v.src.endsWith(src)) return;
    v.src = src; userPaused = false; sync();
  }));
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.35 }).observe(scr);
  document.addEventListener('visibilitychange', sync);
  icons();
}

/* Hero: the showreel replaces the WebGL montage (the montage loop idles while body.reelhero is set). */
function applyHeroReel(url) {
  const st = $('.kv-st');
  if (!st || !url || $('#herovid')) return;
  const v = document.createElement('video');
  v.id = 'herovid';
  Object.assign(v, { src: lean(url, 'hero'), muted: true, loop: true, autoplay: true, playsInline: true, preload: 'auto', poster: lean(url, 'poster') });
  v.setAttribute('aria-hidden', 'true');
  v.addEventListener('playing', () => { document.body.classList.add('reelhero'); document.body.classList.remove('reelwait'); }, { once: true });
  /* if the video cannot play (error or too slow), fall back to the generated montage instead of a blank hero */
  const giveUp = () => document.body.classList.remove('reelwait');
  v.addEventListener('error', giveUp, { once: true });
  setTimeout(() => { if (!document.body.classList.contains('reelhero')) giveUp(); }, 12000);
  st.insertBefore(v, $('#kv').nextSibling);

  /* Only decode while the hero is on screen and nothing covers it (press kit, Machine view, menu, tab hidden),
     otherwise the 1080p video steals the frame budget from scrolling elsewhere. */
  let inView = true;
  const covered = () => !!document.querySelector('#dp.open, #machine.open, #fm.open, #modal:not([hidden])');
  const sync = () => {
    const run = inView && !covered() && !document.hidden;
    if (run && v.paused) v.play().catch(() => {});
    else if (!run && !v.paused) v.pause();
  };
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.05 }).observe(st);
  const mo = new MutationObserver(sync);
  ['#dp', '#machine', '#fm', '#modal'].forEach(q => { const n = $(q); if (n) mo.observe(n, { attributes: true, attributeFilter: ['class', 'hidden'] }); });
  document.addEventListener('visibilitychange', sync);
  sync();
}

function applyContact(email) {
  if (!email) return;
  const mail = $('#mail'); if (mail) mail.textContent = email;
}

loadCMS().then(cms => {
  applyClients(clientsOf(cms));
  applyHeroReel(cms.home?.playReelVideo);
  applyReel(cms.home?.playReelVideo, cms.home?.playReelVideo2);
  applyContact(cms.contact?.email || cms.home?.socials?.email);
});
