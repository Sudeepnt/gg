import markup from "./markup";
import Markup from "./SiteMarkup";
import Boot from "./Boot";
import { getRuntimeContent } from "@/lib/content";
import { applyTexts } from "@/content/pageTextRules";
import { heroHead } from "@/lib/hero";

/* content comes from Supabase (see src/lib/content.ts); the page is refreshed at most every minute and immediately after the admin saves */
export const revalidate = 60;

export default async function Home() {
  const content = await getRuntimeContent();
  const hero = await heroHead(content);
  /* the first carousel slide's <video> goes into the page itself, right after the montage canvas */
  let html = applyTexts(markup, (content as { texts?: Record<string, string> }).texts);
  if (hero.video) {
    html = html.replace('<section id="top" class="win kv', '<section id="top" class="win kv hv').replace(/(<canvas id="kv"[^>]*><\/canvas>)/, `$1${hero.video}`);
  }
  return (
    <>
      {hero.origin && <link rel="preconnect" href={hero.origin} />}
      {hero.style && <style dangerouslySetInnerHTML={{ __html: hero.style.replace(/^<style>|<\/style>$/g, "") }} />}
      <Markup html={html} />
      {/* app.js fills this with the schema.org graph */}
      <script type="application/ld+json" id="ldjson" />
      {/* the editable site content (edited from /admingg); read by app.js, cms.js and pitch.js */}
      <script id="gg-content" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(content).replace(/</g, "\\u003c") }} />
      <Boot />
    </>
  );
}
