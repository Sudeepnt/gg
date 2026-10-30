import "server-only";

/* Server-side head start for the hero carousel's first slide, so the video is already downloading with the HTML and
   something is on screen from the very first paint (no black frame, no waiting for the page script):
   - a <video> for the first slide, with its source picked by the screen width before anything else runs;
   - the slide's poster picture (the CMS stores it next to the video as "<video name>-poster.jpg", made automatically when a
     video is uploaded in the admin) embedded in the page itself, so it needs no request;
   - a preconnect to the media host.
   Media lives only on Cloudflare R2, never on Vercel. */

const MOBILE_QUERY = "(max-width:700px)";
export const posterOf = (url: string) => url.replace(/\.[a-z0-9]+(\?.*)?$/i, "") + "-poster.jpg";

async function dataUri(url: string): Promise<string> {
  try {
    const r = await fetch(url, { next: { revalidate: 3600 } });
    if (!r.ok || !/^image\//.test(r.headers.get("content-type") || "")) return "";
    const b = Buffer.from(await r.arrayBuffer());
    return b.length > 0 && b.length < 140_000 ? `data:image/jpeg;base64,${b.toString("base64")}` : "";
  } catch { return ""; }
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const isHttp = (u: unknown): u is string => typeof u === "string" && /^https?:\/\//.test(u);

export async function heroHead(content: Record<string, any>): Promise<{ video: string; style: string; origin: string }> {
  const s = Array.isArray(content.heroSlides) ? content.heroSlides.find((x: any) => x && (x.pc || x.mobile)) : null;
  if (!s) return { video: "", style: "", origin: "" };
  const pc: string = s.pc || s.mobile, mobile: string = s.mobile || s.pc;
  if (!isHttp(pc) || !isHttp(mobile)) return { video: "", style: "", origin: "" };
  const [pPc, pMob] = await Promise.all([dataUri(posterOf(pc)), dataUri(posterOf(mobile))]);
  const css = (u: string) => (u ? `background-image:url(${u});` : "");
  const style = `<style>.kv-st{background-color:#000;background-size:cover;background-position:center;${css(pPc)}}@media ${MOBILE_QUERY}{.kv-st{${css(pMob || pPc)}}}</style>`;
  /* the inline script runs while the page is still being read, so the right file starts downloading immediately */
  const video = `<video id="herovid" class="herovid on" muted playsinline webkit-playsinline autoplay preload="auto" disablepictureinpicture disableremoteplayback x-webkit-airplay="deny" tabindex="-1" aria-hidden="true"></video>`
    + `<script>(function(){var v=document.getElementById("herovid");if(v)v.src=matchMedia(${JSON.stringify(MOBILE_QUERY)}).matches?${JSON.stringify(mobile)}:${JSON.stringify(pc)}})()</script>`;
  let origin = "";
  try { origin = new URL(pc).origin; } catch {}
  return { video, style, origin };
}
