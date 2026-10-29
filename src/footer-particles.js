/* Footer wordmark as particles: dots scatter away from the pointer and spring back.
   Ported from the old gg site's ParticleText. The real <p class="fwm"> text stays in the DOM (transparent) for
   screen readers, search and as the fallback when this does not run. */
const el = document.getElementById('fwm');

if (el && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const text = el.textContent.trim().toUpperCase();
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const mouse = { x: -1000, y: -1000 };
  let parts = [], raf = 0, visible = false, size = 3, radius = 70;

  const build = () => {
    const cs = getComputedStyle(el);
    const w = el.clientWidth, h = el.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
    if (!w || !h) return;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    ctx.textBaseline = 'alphabetic';
    const m = ctx.measureText('Hg'), A = m.fontBoundingBoxAscent, D = m.fontBoundingBoxDescent;
    const base = (h - (A + D)) / 2 + A;       /* where CSS puts the baseline inside the line box */
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fff';
    ctx.fillText(text, 0, base);
    const fs = parseFloat(cs.fontSize);
    const gap = fs > 100 ? 3 : 2;
    size = gap + 0.4; radius = Math.max(50, fs * 0.38);
    /* sample at device pixels, convert back to CSS pixels */
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data, W = canvas.width;
    parts = [];
    for (let y = 0; y < h; y += gap) for (let x = 0; x < w; x += gap)
      if (data[((Math.round(y * dpr)) * W + Math.round(x * dpr)) * 4 + 3] > 128)
        parts.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
    ctx.font = ''; // font no longer needed
  };

  const frame = () => {
    raf = visible ? requestAnimationFrame(frame) : 0;
    const w = el.clientWidth, h = el.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = getComputedStyle(el).getPropertyValue('--pfill') || '#F3F3F0';
    for (const p of parts) {
      const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
      if (d < radius) { const f = (radius - d) / radius; p.vx -= (dx / d) * f * 20; p.vy -= (dy / d) * f * 20; }
      else { p.vx -= (p.x - p.ox) * 0.04; p.vy -= (p.y - p.oy) * 0.04; }
      p.vx *= 0.92; p.vy *= 0.92; p.x += p.vx; p.y += p.vy;
      ctx.fillRect(p.x, p.y, size, size);
    }
  };

  const start = () => { if (!raf && visible) raf = requestAnimationFrame(frame); };
  canvas.addEventListener('pointermove', e => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  canvas.addEventListener('pointerleave', () => { mouse.x = mouse.y = -1000; });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); }).observe(el);

  const init = () => { build(); if (parts.length) { el.classList.add('pt'); if (!canvas.isConnected) el.appendChild(canvas); } };
  let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { build(); start(); }, 200); });
  (document.fonts?.ready || Promise.resolve()).then(() => { init(); start(); });
}

export {};
