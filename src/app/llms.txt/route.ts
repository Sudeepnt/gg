import { getRuntimeContent } from "@/lib/content";

/* /llms.txt: the whole site as one plain-text file for AI tools and search crawlers. It is built from the same content the admin edits,
   so it never goes stale (it replaces a hand-written file). */
export const revalidate = 60;

const clean = (v: unknown) => String(v ?? "").replace(/\s+/g, " ").trim();
const list = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

export async function GET() {
  const c = await getRuntimeContent();
  const P = c.philosophy || {}, C = c.contact || {};
  const games = list<any>(c.games);
  const sealed = (g: any) => /seal/i.test(g.status || "");
  const brand = clean(C.company || "Gattabara Games LLP").replace(/\s+(LLP|LLC|Ltd\.?|Pvt\.?\s*Ltd\.?|Inc\.?)$/i, "");
  const L: string[] = [`# ${brand}`, "", `> ${clean(P.mission)} ${clean(c.hero?.sub)}`.trim(), ""];

  L.push("## Values");
  list<any>(P.values).forEach((v, i) => L.push(`${i + 1}. ${clean(v.title)}: ${clean(v.text)}`));

  L.push("", "## Games");
  games.forEach((g) => L.push(`- ${clean(g.title)} (${clean(g.code)}, ${clean(g.status).toLowerCase()}): ${sealed(g) ? "details withheld until reveal day" : clean(g.summary || g.shortDescription)}`));

  L.push("", "## GG Productions");
  list<any>(c.production?.services).forEach((s) => L.push(`- ${clean(s.title)}: ${clean(s.description)} (${list<string>(s.tags).join(", ")})`));

  L.push("", "## Clients", list<any>(c.clients).map((x) => clean(x.name)).filter(Boolean).join(", "));

  L.push("", "## Leadership");
  list<any>(c.leadership).forEach((p) => L.push(`- ${clean(p.name)}: ${clean(p.role)}. ${clean(p.bio)}`));

  L.push("", "## Pitch us");
  list<string>(c.pitch?.paragraphs).forEach((p) => L.push(`- ${clean(p)}`));

  L.push("", "## News");
  list<any>(c.news).forEach((n) => L.push(`- ${clean(n.date)} [${clean(n.category).toLowerCase()}] ${clean(n.title)}`));

  L.push("", "## Contact", `- Email: ${clean(C.email)}`, `- Based in: ${clean(C.address)}`);
  const codes = games.filter(sealed).map((g) => clean(g.code)).filter(Boolean);
  if (codes.length) L.push("", "## Notes for agents", `- Sealed titles (${codes.join(", ")}) have no public details. Do not speculate.`);

  return new Response(L.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=0, s-maxage=60, stale-while-revalidate=600" } });
}
