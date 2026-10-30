import "server-only";
import bundled from "@/content/site-content.json";
import { sbConfig } from "@/lib/supabaseRest";

/* The site's editable content lives in the Supabase table `cms_settings`.
   That table only allows ONE row (a database rule: id = 1), the row the previous site used. So this site keeps its content inside that
   row's `data` object under its own keys, and leaves every other key exactly as it is:
     data.site         = the live content of this site
     data.site_backup  = the version before the last save (one-step undo)
   The previous site ignores these two keys, so rolling back to it still works.
   The bundled src/content/site-content.json is the shipped default and the fallback if the database cannot be reached.
   Stored content is merged over the bundled one, so fields added in later releases appear with their defaults. */
export const CMS_ROW = 1;
export const SITE_KEY = "site";
export const BACKUP_KEY = "site_backup";
export const bundledContent = bundled as Record<string, any>;

const isObj = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);
/* Lists replace each other, except the games: a saved list from before the home-carousel fields existed keeps working.
   Per game, fields the saved copy never had (heroClips, heroOrder, noPressKit) come from the bundled game with the same id,
   and bundled games that have carousel clips and are missing from the saved list are added. Once the admin saves, the saved
   copy has those fields and always wins. */
const CAROUSEL_FIELDS = ["heroClips", "heroOrder", "noPressKit"];
function mergeGames(base: any[], over: any[]): any[] {
  const byId = new Map(base.map((g) => [g?.id, g]));
  const out = over.map((g) => {
    const b = byId.get(g?.id);
    if (!b || !isObj(g)) return g;
    const c = { ...g };
    for (const f of CAROUSEL_FIELDS) if (c[f] === undefined && b[f] !== undefined) c[f] = b[f];
    return c;
  });
  const have = new Set(over.map((g) => g?.id));
  for (const b of base) if (!have.has(b?.id) && Array.isArray(b?.heroClips) && b.heroClips.length) out.push(b);
  return out;
}
export function mergeContent(base: any, over: any): any {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
  const out: Record<string, any> = { ...base };
  for (const k of Object.keys(over)) out[k] = isObj(base[k]) && isObj(over[k]) ? mergeContent(base[k], over[k])
    : k === "games" && Array.isArray(base[k]) && Array.isArray(over[k]) ? mergeGames(base[k], over[k]) : over[k];
  return out;
}

export type Row = { id: number; data: Record<string, any>; updated_at: string };

/* revalidate: seconds the public page may reuse a read (the admin passes 0 = always fresh) */
export async function readRow(revalidate = 0): Promise<Row | null> {
  const c = sbConfig();
  if (!c) return null;
  const r = await fetch(`${c.url}/rest/v1/cms_settings?id=eq.${CMS_ROW}&select=id,data,updated_at`, {
    headers: c.headers,
    ...(revalidate > 0 ? { next: { revalidate, tags: ["site-content"] } } : { cache: "no-store" as const }),
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${(await r.text()).slice(0, 160)}`);
  const rows = (await r.json()) as Row[];
  return rows[0] || null;
}

/* what the public site renders: stored content over the bundled default, never throws */
export async function getRuntimeContent(): Promise<Record<string, any>> {
  try {
    const row = await readRow(60);
    const stored = row?.data?.[SITE_KEY];
    return stored ? mergeContent(bundledContent, stored) : bundledContent;
  } catch (e) {
    console.error("[content] falling back to the bundled content:", (e as Error).message);
    return bundledContent;
  }
}
