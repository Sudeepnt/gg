/* Applies the carried-over gg CMS data to the page: client logos, the reel video and the contact email. */
import { loadCMS, clientsOf, siteContent } from './cms.js';
import { tx } from './tx.js';

const $ = s => document.querySelector(s);

/* The CMS stores the original 33 MB 1080p upload on r2.dev, which is slow. For that known file we play a lean 720p copy that sits next to
   it in the same Cloudflare R2 bucket (never on Vercel: no media is ever stored with the site). Any other CMS URL is used as is. */
const LEAN = {
  '1774408082516-GG_Website_Showreel-(1)-(1).mp4': { full: 'applications/site/videos/showreel-720.mp4', poster: 'applications/site/images/showreel-poster.jpg' },
};
const lean = (url, kind) => {
  const k = url && Object.keys(LEAN).find(n => url.includes(n));
  if (!k) return kind === 'poster' ? '' : url;
  try { return new URL(url).origin + '/' + LEAN[k][kind]; } catch { return kind === 'poster' ? '' : url; }
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* if the media Worker ever fails, play the same file straight from the bucket's r2.dev address */
const mediaHosts = () => siteContent()?.mediaHosts;
function mediaFallback(el) {
  const mh = mediaHosts(), src = el.getAttribute('src') || '';
  if (!mh || !src.startsWith(mh.worker + '/')) return false;
  el.src = mh.origin + src.slice(mh.worker.length);
  el.load();
  el.play().catch(() => {});
  return true;
}

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
  v.addEventListener('error', () => mediaFallback(v));
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

/* Hero: an Instagram-stories style carousel, edited in the CMS (Home -> "Home carousel -> slides"). Every slide has a PC video and a
   mobile video, an optional game (for the Press kit button) and a caption. Tap the left or right edge to go back or forward, press
   and hold to pause. Two video elements take turns so the next slide is already loaded when it starts. While it runs,
   body.stories keeps the generated WebGL montage idle. */
function applyHeroStories(games, slides) {
  const st = $('.kv-st'), box = $('#stories');
  if (!st || !box || window.__ggStories) return;
  window.__ggStories = true;
  const mq = window.matchMedia('(max-width: 700px)');
  let list = (slides || []).filter(x => x && (x.pc || x.mobile)).map(x => {
    /* slides are standalone: nothing here reads the Games list, so editing games never changes the carousel */
    return { title: x.title || '', cardCaption: x.caption || '', pc: x.pc, mobile: x.mobile, i: -1, pk: false };
  });
  if (!list.length) return;                    /* nothing to play: keep the generated montage */
  const srcOf = g => (mq.matches ? (g.mobile || g.pc) : (g.pc || g.mobile));
  const same = (a, b) => !!a && !!b && a.split('/').pop() === b.split('/').pop();

  const mk = id => {
    const e = document.createElement('video');
    if (id) e.id = id;
    e.className = 'herovid';
    Object.assign(e, { muted: true, playsInline: true, preload: 'auto' });
    e.controls = false;
    ['webkit-playsinline', 'disablepictureinpicture', 'disableremoteplayback'].forEach(a => e.setAttribute(a, ''));
    e.setAttribute('x-webkit-airplay', 'deny');
    e.setAttribute('tabindex', '-1');
    e.setAttribute('aria-hidden', 'true');
    return e;
  };
  /* the first slide's <video> is already in the page (server-rendered, started downloading with the HTML): adopt it instead of making a new one */
  const pre = document.getElementById('herovid');
  const vids = [pre || mk('herovid'), mk()];
  let v = vids[0];
  vids.forEach(e => { if (!e.isConnected) st.insertBefore(e, $('#kv').nextSibling); });
  if (pre) { pre.classList.add('herovid'); pre.removeAttribute('autoplay'); pre.controls = false; pre.removeAttribute('controls'); }
  if (pre && pre.error) mediaFallback(pre);       /* it may have failed before this script ran */
  const bars = $('#stbars'), lb = $('#stlb'), sb = $('#stsb'), pk = $('#stpk');
  bars.innerHTML = list.map(() => '<span><i></i></span>').join('');
  const fills = [...bars.querySelectorAll('i')];
  let cur = -1, swapTok = 0, held = false, inView = true, ready = -1;   /* ready: index of the slide loaded into the idle video */
  const covered = () => !!document.querySelector('#dp.open, #machine.open, #fm.open, #modal:not([hidden])');
  const sync = () => {
    const run = inView && !covered() && !document.hidden && !held;
    if (run && v.paused) v.play().catch(() => {}); else if (!run && !v.paused) v.pause();
  };
  const prepare = k => {                       /* load slide k into the idle video, ahead of time */
    const idle = vids[0] === v ? vids[1] : vids[0], src = srcOf(list[k]);
    if (!src) return;
    if (!same(idle.getAttribute('src'), src)) { idle.src = src; idle.load(); }
    ready = k;
  };
  const show = (i, first) => {
    cur = (i + list.length) % list.length;
    const g = list[cur], src = srcOf(g);
    fills.forEach((f, k) => { f.style.width = k < cur ? '100%' : '0'; });
    lb.textContent = (g.title || '').toUpperCase();
    sb.textContent = g.cardCaption || '';
    pk.hidden = !g.pk;
    pk.textContent = tx('Press kit →');
    /* play the slide on the idle video and only swap once its first frame is painted, so the previous clip stays up meanwhile (no flash of another game) */
    const old = v, tgt = first ? v : (vids[0] === v ? vids[1] : vids[0]), tok = ++swapTok;
    if (src && !same(tgt.getAttribute('src'), src)) { tgt.src = src; tgt.load(); }
    v = tgt;
    if (!(first && !tgt.paused)) { try { tgt.currentTime = 0; } catch {} }
    let done = false;
    const reveal = () => {
      if (done || tok !== swapTok) return;
      done = true;
      tgt.style.zIndex = 1; tgt.classList.add('on');
      if (old !== tgt) { old.style.zIndex = 0; old.classList.remove('on'); old.pause(); }
    };
    sync();
    const pl = tgt.play();
    if (pl && pl.then) pl.then(() => (tgt.requestVideoFrameCallback ? tgt.requestVideoFrameCallback(reveal) : reveal())).catch(() => {});
    tgt.addEventListener('playing', reveal, { once: true });
    setTimeout(reveal, 900);
    prepare((cur + 1) % list.length);
  };
  const onTime = e => { if (e.target === v && cur >= 0 && v.duration) fills[cur].style.width = (v.currentTime / v.duration * 100) + '%'; };
  vids.forEach(e => {
    e.addEventListener('timeupdate', onTime);
    e.addEventListener('ended', ev => { if (ev.target === v) show(cur + 1); });
    e.addEventListener('error', ev => {
      if (mediaFallback(ev.target)) return;
      if (ev.target !== v) return;
      if (cur < 0) { document.body.classList.remove('reelwait', 'stories'); document.querySelector('.kv')?.classList.remove('hv'); box.hidden = true; } else if (list.length > 1) show(cur + 1);
    });
    e.addEventListener('playing', () => { document.body.classList.add('reelhero'); document.body.classList.remove('reelwait'); }, { once: true });
  });
  mq.addEventListener('change', () => { if (cur >= 0) { v.src = srcOf(list[cur]); v.currentTime = 0; sync(); prepare((cur + 1) % list.length); } });

  /* tap an edge: previous / next. Press and hold anywhere on an edge: pause until released. */
  [[$('#stprev'), -1], [$('#stnext'), 1]].forEach(([el, d]) => {
    let t0 = 0, timer = 0, long = false;
    el.addEventListener('contextmenu', e => e.preventDefault());
    el.addEventListener('mousedown', e => e.preventDefault());   /* no focus ring, no text selection */
    el.addEventListener('dragstart', e => e.preventDefault());
    el.addEventListener('pointerdown', () => { t0 = Date.now(); long = false; timer = setTimeout(() => { long = true; held = true; sync(); }, 220); });
    const up = () => { clearTimeout(timer); if (held) { held = false; sync(); } };
    el.addEventListener('pointerup', () => { const was = long; up(); if (!was && Date.now() - t0 < 600) show(cur + d); });
    ['pointerleave', 'pointercancel'].forEach(e => el.addEventListener(e, up));
  });
  document.addEventListener('keydown', e => {
    if (!inView || covered() || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) return;
    if (e.key === 'ArrowRight') show(cur + 1); else if (e.key === 'ArrowLeft') show(cur - 1);
  });
  pk.addEventListener('click', e => { e.stopPropagation(); const i = list[cur].i; if (i >= 0) document.querySelector(`.gc[data-i="${i}"]`)?.click(); });

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.05 }).observe(st);
  const mo = new MutationObserver(sync);
  ['#dp', '#machine', '#fm', '#modal'].forEach(q => { const n = $(q); if (n) mo.observe(n, { attributes: true, attributeFilter: ['class', 'hidden'] }); });
  document.addEventListener('visibilitychange', sync);
  box.hidden = false;
  document.body.classList.add('stories');
  setTimeout(() => { if (!document.body.classList.contains('reelhero')) document.body.classList.remove('reelwait'); }, 12000);
  show(0, true);
}

function applyContact(email) {
  if (!email) return;
  const mail = $('#mail'); if (mail) mail.textContent = email;
}

loadCMS().then(cms => {
  applyClients(clientsOf(cms));
  applyHeroStories(siteContent()?.games, siteContent()?.heroSlides);
  applyReel(cms.home?.playReelVideo, cms.home?.playReelVideo2);
  applyContact(cms.contact?.email || cms.home?.socials?.email);
});
