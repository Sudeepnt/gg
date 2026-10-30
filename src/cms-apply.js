/* Applies the carried-over gg CMS data to the page: client logos, the reel video and the contact email. */
import { loadCMS, clientsOf, siteContent } from './cms.js';
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
   (home.playReelVideo2, falling back to the main one). No native controls: it autoplays muted
   while on screen, with the old site's round play/pause, volume and full-view (popup) buttons plus a thin progress line as an overlay. */
const IC = {
  play: '<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>',
  pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  vol: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  full: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
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
  ctl.innerHTML = `<div class="rv-row"><button type="button" class="rv-btn" data-a="play" aria-label="${tx('Pause reel')}">${svg('pause')}</button><button type="button" class="rv-btn" data-a="mute" aria-label="${tx('Unmute reel')}">${svg('mute')}</button><button type="button" class="rv-btn" data-a="full" aria-label="${tx('Full screen')}">${svg('full')}</button></div><div class="rv-bar" role="progressbar" aria-label="${tx('Reel progress')}"><i></i></div>`;
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
  /* full view: like the old site, the reel opens as a popup over a dimmed, blurred page (not browser full screen) */
  ctl.querySelector('[data-a=full]').onclick = e => {
    e.stopPropagation();
    if (document.querySelector('.rv-pop')) return;
    const wasPlaying = !v.paused;
    v.pause(); userPaused = true;
    const pop = document.createElement('div');
    pop.className = 'rv-pop';
    pop.setAttribute('data-lenis-prevent', '');
    pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-modal', 'true'); pop.setAttribute('aria-label', tx('Reel'));
    pop.innerHTML = `<div class="rv-pop-box"><video class="rv-pop-vid" playsinline loop></video></div><div class="rv-pop-ctl"><div class="rv-row"><button type="button" class="rv-btn" data-a="play">${svg('pause')}</button><button type="button" class="rv-btn" data-a="close" aria-label="${tx('Close')}">${svg('close')}</button><button type="button" class="rv-btn" data-a="mute">${svg('mute')}</button></div><div class="rv-bar"><i></i></div></div>`;
    const pv = pop.querySelector('video');
    pv.src = v.currentSrc || v.src; pv.muted = v.muted; pv.poster = v.poster;
    pv.addEventListener('loadedmetadata', () => { try { pv.currentTime = v.currentTime; } catch {} }, { once: true });
    document.body.appendChild(pop);
    const oPlay = pop.querySelector('[data-a=play]'), oMute = pop.querySelector('[data-a=mute]'), oBar = pop.querySelector('.rv-bar'), oFill = oBar.firstChild;
    const oIcons = () => { oPlay.innerHTML = svg(pv.paused ? 'play' : 'pause'); oMute.innerHTML = svg(pv.muted ? 'mute' : 'vol'); };
    const oToggle = () => { if (pv.paused) pv.play().catch(() => {}); else pv.pause(); };
    const close = () => {
      document.removeEventListener('keydown', onKey);
      try { v.currentTime = pv.currentTime; } catch {}
      v.muted = pv.muted; pop.remove(); document.body.style.overflow = prevOverflow;
      userPaused = !wasPlaying; icons(); sync();
    };
    const onKey = ev => { if (ev.key === 'Escape') close(); else if (ev.key === ' ') { ev.preventDefault(); oToggle(); } };
    const prevOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    oPlay.onclick = ev => { ev.stopPropagation(); oToggle(); };
    oMute.onclick = ev => { ev.stopPropagation(); pv.muted = !pv.muted; oIcons(); };
    pop.querySelector('[data-a=close]').onclick = ev => { ev.stopPropagation(); close(); };
    pv.addEventListener('click', oToggle);
    pop.addEventListener('click', ev => { if (ev.target === pop) close(); });
    ['play', 'pause', 'volumechange'].forEach(n => pv.addEventListener(n, oIcons));
    pv.addEventListener('timeupdate', () => { oFill.style.width = (pv.duration ? pv.currentTime / pv.duration * 100 : 0) + '%'; });
    oBar.addEventListener('click', ev => { ev.stopPropagation(); const r = oBar.getBoundingClientRect(); if (pv.duration) pv.currentTime = (ev.clientX - r.left) / r.width * pv.duration; });
    pv.play().catch(() => {}); oIcons();
  };
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

/* Hero: an Instagram-stories style carousel. One slide per game, each a short clip (the CMS gives every game a PC video and a
   mobile video; until they are uploaded every slide plays the 7-second cut of the showreel). Tap the left or right edge to go
   back or forward, press and hold to pause. While it runs, body.stories keeps the generated WebGL montage idle. */
const REEL7 = { pc: '/reels/showreel-7s.mp4', mobile: '/reels/showreel-7s-mobile.mp4' };
function applyHeroStories(games, url) {
  const st = $('.kv-st'), box = $('#stories');
  if (!st || !box || $('#herovid')) return;
  /* one slide per clip: every game's "Home carousel" clips (PC + mobile video); with none set, the sample showreel cut plays */
  const mq = window.matchMedia('(max-width: 700px)');
  let list = [];
  (games || []).forEach((g, i) => (g.heroClips || []).forEach(c => {
    if (c.pc || c.mobile) list.push({ title: g.title, cardCaption: c.caption || g.cardCaption, pc: c.pc, mobile: c.mobile, i, pk: !g.noPressKit });
  }));
  const pos = i => Number(games[i]?.heroOrder) || 999;           /* "Home carousel position" in the CMS; ties keep the Games order */
  list = list.map((x, k) => [x, k]).sort((a, b) => pos(a[0].i) - pos(b[0].i) || a[1] - b[1]).map(x => x[0]);
  if (!list.length && url) list = [{ title: 'Gattabara Games', pc: REEL7.pc, mobile: REEL7.mobile, pk: false }];
  if (!list.length) return;                    /* nothing to play: keep the generated montage */
  const srcOf = g => (mq.matches ? (g.mobile || g.pc) : (g.pc || g.mobile));

  const v = document.createElement('video');
  v.id = 'herovid';
  Object.assign(v, { muted: true, playsInline: true, preload: 'auto', poster: '' });
  v.setAttribute('aria-hidden', 'true');
  st.insertBefore(v, $('#kv').nextSibling);
  const bars = $('#stbars'), lb = $('#stlb'), sb = $('#stsb'), pk = $('#stpk');
  bars.innerHTML = list.map(() => '<span><i></i></span>').join('');
  const fills = [...bars.querySelectorAll('i')];
  let cur = -1, held = false, inView = true;
  const covered = () => !!document.querySelector('#dp.open, #machine.open, #fm.open, #modal:not([hidden])');
  const sync = () => {
    const run = inView && !covered() && !document.hidden && !held;
    if (run && v.paused) v.play().catch(() => {}); else if (!run && !v.paused) v.pause();
  };
  const show = i => {
    cur = (i + list.length) % list.length;
    const g = list[cur];
    fills.forEach((f, k) => { f.style.width = k < cur ? '100%' : '0'; });
    lb.textContent = (g.title || '').toUpperCase();
    sb.textContent = g.cardCaption || '';
    pk.hidden = !g.pk;
    pk.textContent = tx('Press kit ↗');
    const src = srcOf(g);
    if (src && !v.src.endsWith(src)) v.src = src; else v.currentTime = 0;
    v.play().catch(() => {});
    sync();
  };
  v.addEventListener('timeupdate', () => { if (cur >= 0 && v.duration) fills[cur].style.width = (v.currentTime / v.duration * 100) + '%'; });
  v.addEventListener('ended', () => show(cur + 1));
  v.addEventListener('error', () => { if (cur < 0) { document.body.classList.remove('reelwait'); box.hidden = true; document.body.classList.remove('stories'); } else show(cur + 1); });
  v.addEventListener('playing', () => { document.body.classList.add('reelhero'); document.body.classList.remove('reelwait'); }, { once: true });
  mq.addEventListener('change', () => { if (cur >= 0) { v.src = srcOf(list[cur]); sync(); } });

  /* tap an edge: previous / next. Press and hold anywhere on an edge: pause until released. */
  [[$('#stprev'), -1], [$('#stnext'), 1]].forEach(([el, d]) => {
    el.addEventListener('contextmenu', e => e.preventDefault());
    el.addEventListener('mousedown', e => e.preventDefault());   /* no focus ring, no text selection */
    el.addEventListener('dragstart', e => e.preventDefault());
    let t0 = 0, timer = 0, long = false;
    el.addEventListener('pointerdown', () => { t0 = Date.now(); long = false; timer = setTimeout(() => { long = true; held = true; sync(); }, 220); });
    const up = () => { clearTimeout(timer); if (held) { held = false; sync(); } };
    el.addEventListener('pointerup', () => { const was = long; up(); if (!was && Date.now() - t0 < 600) show(cur + d); });
    ['pointerleave', 'pointercancel'].forEach(e => el.addEventListener(e, up));
  });
  document.addEventListener('keydown', e => {
    if (!inView || covered() || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
    if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1);
  });
  pk.addEventListener('click', e => { e.stopPropagation(); document.querySelector(`.gc[data-i="${list[cur].i}"]`)?.click(); });

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.05 }).observe(st);
  const mo = new MutationObserver(sync);
  ['#dp', '#machine', '#fm', '#modal'].forEach(q => { const n = $(q); if (n) mo.observe(n, { attributes: true, attributeFilter: ['class', 'hidden'] }); });
  document.addEventListener('visibilitychange', sync);
  box.hidden = false;
  document.body.classList.add('stories');
  const giveUp = () => document.body.classList.remove('reelwait');
  setTimeout(() => { if (!document.body.classList.contains('reelhero')) giveUp(); }, 12000);
  show(0);
}

function applyContact(email) {
  if (!email) return;
  const mail = $('#mail'); if (mail) mail.textContent = email;
}

loadCMS().then(cms => {
  applyClients(clientsOf(cms));
  applyHeroStories(siteContent()?.games, cms.home?.playReelVideo);
  applyReel(cms.home?.playReelVideo, cms.home?.playReelVideo2);
  applyContact(cms.contact?.email || cms.home?.socials?.email);
});
