import "server-only";
import bundled from "@/content/site-content.json";
import { sbConfig } from "@/lib/supabaseRest";

/* The site's editable content lives in the Supabase table `cms_settings`:
     id 2  = the live content of this site          (the previous site's row, id 1, is never touched)
     id 3  = the version before the last save        (one-step undo)
   The bundled src/content/site-content.json is the shipped default and the fallback if the database cannot be reached.
   Stored content is merged over the bundled one, so fields added in later releases appear with their defaults. */
export const CONTENT_ROW = 2;
export const BACKUP_ROW = 3;
export const bundledContent = bundled as Record<string, any>;

const isObj = (v: unknown): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);
export function mergeContent(base: any, over: any): any {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
  const out: Record<string, any> = { ...base };
  for (const k of Object.keys(over)) out[k] = isObj(base[k]) && isObj(over[k]) ? mergeContent(base[k], over[k]) : over[k];
  return out;
}

export type Row = { id: number; data: Record<string, any>; updated_at: string };

/* revalidate: seconds the public page may reuse a read (the admin passes 0 = always fresh) */
export async function readRow(id: number, revalidate = 0): Promise<Row | null> {
  const c = sbConfig();
  if (!c) return null;
  const r = await fetch(`${c.url}/rest/v1/cms_settings?id=eq.${id}&select=id,data,updated_at`, {
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
    const row = await readRow(CONTENT_ROW, 60);
    return row?.data ? mergeContent(bundledContent, row.data) : bundledContent;
  } catch (e) {
    console.error("[content] falling back to the bundled content:", (e as Error).message);
    return bundledContent;
  }
}
