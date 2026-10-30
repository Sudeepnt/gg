import { getRuntimeContent } from "@/lib/content";

export const revalidate = 60;

/* wording comes from the admin (Page title & 404 tab) */
export default async function NotFound() {
  const c = await getRuntimeContent();
  const N = (c.notFound || {}) as Record<string, string>;
  return (
    <div className="lg">
      <header className="lg-top">
        <a href="/" className="lg-brand" aria-label="Gattabara Games">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gg-mark.png" alt="Gattabara Games" width={1275} height={746} />
        </a>
      </header>
      <main className="lg-wrap">
        <p className="lg-k">404</p>
        <h1>{N.title || "Page not found"}</h1>
        <p className="lg-lead">{N.text || "The page you are looking for does not exist or has moved."}</p>
        <a href="/" className="lg-back">{N.button || "Back to the home page"}</a>
      </main>
    </div>
  );
}
