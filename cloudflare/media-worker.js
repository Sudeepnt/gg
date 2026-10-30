/* Media Worker: serves the carousel videos and posters from the R2 bucket through Cloudflare's network.
   - range requests for video, one-year browser cache;
   - a copy of each file is kept in Cloudflare's edge cache, so repeat requests are answered near the visitor without reading R2;
   - only files under applications/site/ are served; everything else in the bucket stays private.
   Paste this into the Worker and bind the R2 bucket as "BUCKET" (steps are in the README). */
const baseHeaders = (obj) => {
  const h = new Headers();
  obj.writeHttpMetadata(h);
  h.set("etag", obj.httpEtag);
  h.set("accept-ranges", "bytes");
  h.set("cache-control", "public, max-age=31536000, immutable");
  h.set("access-control-allow-origin", "*");
  return h;
};

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method not allowed", { status: 405 });
    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.slice(1));
    if (!key.startsWith("applications/site/") || key.includes("..")) return new Response("Not found", { status: 404 });

    const cache = caches.default;
    const cacheKey = new Request(url.origin + url.pathname);          /* one entry per file, whatever range is asked */
    const ranged = request.headers.has("range");

    /* edge cache: answers whole-file and range requests alike */
    const hit = await cache.match(request.method === "GET" ? request : cacheKey);
    if (hit) {
      const h = new Headers(hit.headers);
      h.set("x-cache", "HIT");
      return new Response(request.method === "HEAD" ? null : hit.body, { status: hit.status, headers: h });
    }

    const obj = await env.BUCKET.get(key, { range: request.headers, onlyIf: request.headers });
    if (!obj) return new Response("Not found", { status: 404 });
    const headers = baseHeaders(obj);
    headers.set("x-cache", "MISS");
    if (!("body" in obj)) return new Response(null, { status: 304, headers });   /* conditional request: unchanged */

    let status = 200;
    const r = obj.range;
    if (ranged && r) {
      let start, end;
      if (r.suffix !== undefined) { start = Math.max(0, obj.size - r.suffix); end = obj.size - 1; }
      else { start = r.offset ?? 0; end = r.length !== undefined ? start + r.length - 1 : obj.size - 1; }
      headers.set("content-range", `bytes ${start}-${end}/${obj.size}`);
      headers.set("content-length", String(end - start + 1));
      status = 206;
    } else {
      headers.set("content-length", String(obj.size));
    }

    /* fill the edge cache with the whole file in the background (a whole-file answer is cached as it streams) */
    if (request.method === "GET") {
      if (status === 200) {
        const [toClient, toCache] = obj.body.tee();
        ctx.waitUntil(cache.put(cacheKey, new Response(toCache, { status: 200, headers: baseHeaders(obj) })));
        return new Response(toClient, { status, headers });
      }
      ctx.waitUntil((async () => {
        const full = await env.BUCKET.get(key);
        if (full) await cache.put(cacheKey, new Response(full.body, { status: 200, headers: baseHeaders(full) }));
      })());
    }
    return new Response(request.method === "HEAD" ? null : obj.body, { status, headers });
  },
};
