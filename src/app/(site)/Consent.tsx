"use client";

import { useCallback, useEffect, useState } from "react";

/* Cookie / storage consent popup, shown on the first visit (and again after 6 months, or from the footer's "Cookie settings").
   Necessary storage is always on. Analytics and marketing are OFF until the visitor opts in; nothing in the site uses them yet,
   but any script added later must wait for window.ggConsent.analytics / .marketing (or the "gg:consent" event). */
const KEY = "gg_consent";
const MAX_AGE_DAYS = 180;
type Choice = { v: 1; t: number; analytics: boolean; marketing: boolean };

declare global {
  interface Window { ggConsent?: Choice | null }
}

function read(): Choice | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || "null") as Choice | null;
    if (!c || c.v !== 1 || Date.now() - c.t > MAX_AGE_DAYS * 864e5) return null;
    return c;
  } catch { return null; }
}

function save(analytics: boolean, marketing: boolean) {
  const c: Choice = { v: 1, t: Date.now(), analytics, marketing };
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* storage blocked: the choice lasts for this visit only */ }
  try { document.cookie = `${KEY}=a${+analytics}m${+marketing}; Max-Age=${MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`; } catch { /* ignore */ }
  window.ggConsent = c;
  window.dispatchEvent(new CustomEvent("gg:consent", { detail: c }));
}

const DEF = {
  kicker: "Cookies & privacy", title: "Your choice",
  text: "We use a small amount of storage that the site needs to work. With your permission we would also use analytics and marketing cookies. Nothing optional is switched on until you say so.",
  policyLink: "Read our Privacy Policy", accept: "Accept all", reject: "Reject all", customise: "Customise", save: "Save my choices",
  necessaryTitle: "Necessary", necessaryText: "Remembers this choice and small interface settings. Always on.",
  analyticsTitle: "Analytics", analyticsText: "Helps us understand how the site is used, so we can improve it.",
  marketingTitle: "Marketing", marketingText: "Used to measure and show our own campaigns on other sites.",
};
type Text = typeof DEF;

/* wording comes from the CMS (admin -> Privacy policy -> Cookie popup); anything left empty falls back to the default */
export default function Consent({ text }: { text?: Partial<Text> }) {
  const T = { ...DEF, ...Object.fromEntries(Object.entries(text || {}).filter(([, v]) => typeof v === "string" && v.trim())) } as Text;
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(false);
  const [an, setAn] = useState(false);
  const [mk, setMk] = useState(false);

  useEffect(() => {
    const c = read();
    window.ggConsent = c;
    if (c) { setAn(c.analytics); setMk(c.marketing); return; }
    const t = setTimeout(() => setOpen(true), 900);   /* let the page paint first */
    return () => clearTimeout(t);
  }, []);

  /* footer link: <button data-cookie-settings> */
  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.("[data-cookie-settings]")) return;
      e.preventDefault();
      const c = read();
      setAn(!!c?.analytics); setMk(!!c?.marketing); setDetail(true); setOpen(true);
    };
    document.addEventListener("click", on);
    return () => document.removeEventListener("click", on);
  }, []);

  const done = useCallback((a: boolean, m: boolean) => { save(a, m); setAn(a); setMk(m); setOpen(false); setDetail(false); }, []);

  if (!open) return null;
  return (
    <div className="ck" role="dialog" aria-modal="false" aria-labelledby="ck-t" data-lenis-prevent>
      <p className="ck-k">{T.kicker}</p>
      <h2 id="ck-t">{T.title}</h2>
      <p className="ck-p">{T.text} <a href="/privacy-policy">{T.policyLink}</a>.</p>
      {detail && (
        <div className="ck-list">
          <label className="ck-row">
            <span><b>{T.necessaryTitle}</b><small>{T.necessaryText}</small></span>
            <input type="checkbox" checked disabled aria-label={T.necessaryTitle} />
          </label>
          <label className="ck-row">
            <span><b>{T.analyticsTitle}</b><small>{T.analyticsText}</small></span>
            <input type="checkbox" checked={an} onChange={(e) => setAn(e.target.checked)} />
          </label>
          <label className="ck-row">
            <span><b>{T.marketingTitle}</b><small>{T.marketingText}</small></span>
            <input type="checkbox" checked={mk} onChange={(e) => setMk(e.target.checked)} />
          </label>
        </div>
      )}
      <div className="ck-btns">
        <button type="button" className="ck-b ck-pri" onClick={() => done(true, true)}>{T.accept}</button>
        <button type="button" className="ck-b" onClick={() => done(false, false)}>{T.reject}</button>
        {detail
          ? <button type="button" className="ck-b" onClick={() => done(an, mk)}>{T.save}</button>
          : <button type="button" className="ck-b" onClick={() => setDetail(true)}>{T.customise}</button>}
      </div>
    </div>
  );
}
