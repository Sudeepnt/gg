import type { Metadata } from "next";
import { getRuntimeContent } from "@/lib/content";
import { RichText, inline } from "@/lib/richtext";

/* the whole policy is edited in the admin (Privacy policy tab); refreshed at most every minute and right after a save */
export const revalidate = 60;

type Sec = { title?: string; body?: string };

export async function generateMetadata(): Promise<Metadata> {
  const c = await getRuntimeContent();
  return {
    title: `${c.privacy?.title || "Privacy Policy"} — Gattabara Games`,
    description: String(c.privacy?.lead || "").slice(0, 200) || "How Gattabara Games LLP handles personal data.",
    alternates: { canonical: "/privacy-policy" },
  };
}

export default async function PrivacyPolicy() {
  const c = await getRuntimeContent();
  const P = c.privacy || {};
  const secs: Sec[] = (Array.isArray(P.sections) ? P.sections : []).filter((s: Sec) => s && (s.title || s.body));
  const cl = P.cookieLabel || "Cookie settings";
  const nn = (i: number) => String(i + 1).padStart(2, "0");
  return (
    <div className="lg">
      <header className="lg-top">
        <a href="/" className="lg-brand" aria-label="Gattabara Games, back to the home page">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gg-mark.png" alt="Gattabara Games" width={1275} height={746} />
        </a>
        <a href="/" className="lg-back">{P.backLink || "← Back to site"}</a>
      </header>

      <main className="lg-wrap">
        {P.kicker && <p className="lg-k">{P.kicker}</p>}
        <h1>{P.title || "Privacy Policy"}</h1>
        {P.updated && <p className="lg-meta">{P.updated}</p>}
        {P.lead && <p className="lg-lead">{inline(String(P.lead), cl)}</p>}

        {secs.length > 1 && (
          <nav className="lg-toc" aria-label={P.tocTitle || "Contents"}>
            <p className="lg-k">{P.tocTitle || "In this policy"}</p>
            <ol>{secs.map((s, i) => <li key={i}><a href={`#s${i + 1}`}>{s.title}</a></li>)}</ol>
          </nav>
        )}

        {secs.map((s, i) => (
          <section key={i} id={`s${i + 1}`}>
            <h2><span>{nn(i)}</span>{s.title}</h2>
            <RichText text={s.body || ""} cookieLabel={cl} />
          </section>
        ))}
      </main>

      <footer className="lg-foot">
        <span>{P.copyright || "© 2026 Gattabara Games LLP. All rights reserved."}</span>
        <button type="button" className="lg-link" data-cookie-settings>{cl}</button>
      </footer>
    </div>
  );
}
