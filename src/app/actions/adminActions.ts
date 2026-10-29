"use server";

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { sbConfig } from "@/lib/supabaseRest";
import { BACKUP_KEY, CMS_ROW, SITE_KEY, bundledContent, mergeContent, readRow, type Row } from "@/lib/content";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/* Admin back end for the current site. No database: content is one JSON file (src/content/site-content.json).
   Saving writes that file when the server's disk is writable (local dev / any normal server). On Vercel the disk is
   read-only, so the dashboard offers Export instead; swap saveSiteContent for a database later without touching the UI. */

const CONTENT_FILE = path.join(process.cwd(), "src/content/site-content.json");
const PASSWORD = process.env.ADMIN_PASSWORD || "gg5656";
/* signing secret for the login cookie: ADMIN_SECRET if set, otherwise a server-only secret that already exists, so it can't be derived from the public code */
const SECRET = process.env.ADMIN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "gg-admin-secret-change-me";
const COOKIE = "gg_admin";
const token = () => crypto.createHmac("sha256", SECRET).update(PASSWORD).digest("hex");
const canWrite = () => !process.env.VERCEL && process.env.NODE_ENV !== "production";

async function requireAdmin() {
  const c = (await cookies()).get(COOKIE)?.value;
  if (c !== token()) throw new Error("Not authorised. Please log in again.");
}

export async function loginAdmin(password: string) {
  if (password !== PASSWORD) return { ok: false };
  (await cookies()).set(COOKIE, token(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return { ok: true };
}

export async function logoutAdmin() {
  (await cookies()).delete(COOKIE);
  return { ok: true };
}

/* ---- content: Supabase table cms_settings, row 1, keys data.site (live) and data.site_backup (previous). Other keys are preserved. ---- */
type Slice = { site?: any; backup?: any };
/* write `slice` into row 1's data, keeping every other key; compare-and-swap on updated_at so two editors can't overwrite each other.
   returns the saved row, or null when the row changed since `version` was read */
async function writeSlice(current: Row | null, slice: Slice, version: string | null): Promise<Row | null> {
  const c = sbConfig()!;
  const now = new Date().toISOString();
  const data = { ...(current?.data || {}) } as Record<string, any>;
  if (slice.site !== undefined) data[SITE_KEY] = slice.site;
  if (slice.backup !== undefined) data[BACKUP_KEY] = slice.backup;
  const h = { ...c.headers, "Content-Type": "application/json", Prefer: "return=representation" };
  if (!current) {
    const r = await fetch(`${c.url}/rest/v1/cms_settings`, { method: "POST", headers: { ...h, Prefer: "return=representation,resolution=ignore-duplicates" }, body: JSON.stringify({ id: CMS_ROW, data, default_data: bundledContent, updated_at: now }) });
    if (!r.ok) throw new Error(`Save failed (${r.status}) ${(await r.text()).slice(0, 160)}`);
    return ((await r.json()) as Row[])[0] || null;                  /* null = a row appeared meanwhile */
  }
  const r = await fetch(`${c.url}/rest/v1/cms_settings?id=eq.${CMS_ROW}&updated_at=eq.${encodeURIComponent(version || current.updated_at)}`, { method: "PATCH", headers: h, body: JSON.stringify({ data, updated_at: now }) });
  if (!r.ok) throw new Error(`Save failed (${r.status}) ${(await r.text()).slice(0, 160)}`);
  return ((await r.json()) as Row[])[0] || null;                    /* null = changed elsewhere */
}

export async function getSiteContent() {
  try {
    await requireAdmin();
    if (sbConfig()) {
      const row = await readRow();
      return { ok: true as const, content: mergeContent(bundledContent, row?.data?.[SITE_KEY]), canSave: true, storage: "database" as const, version: row?.updated_at ?? null, hasBackup: !!row?.data?.[BACKUP_KEY] };
    }
    const content = JSON.parse(await fs.readFile(CONTENT_FILE, "utf-8"));
    return { ok: true as const, content, canSave: canWrite(), storage: "file" as const, version: null, hasBackup: false };
  } catch (e: any) {
    const m = String(e?.message || "");
    return { ok: false as const, error: /not authori[sz]ed/i.test(m) ? m : /fetch failed|ECONN|ENOTFOUND|timeout/i.test(m) ? "Could not reach the database (Supabase). Your content is safe. Check the connection and try again." : m || "Could not load content" };
  }
}

export async function saveSiteContent(content: any, version: string | null) {
  try {
    await requireAdmin();
    if (!content || typeof content !== "object" || !Array.isArray(content.games) || !Array.isArray(content.news)) throw new Error("That does not look like site content.");
    if (sbConfig()) {
      const current = await readRow();
      if ((current?.updated_at ?? null) !== (version ?? null)) return { ok: false, conflict: true, error: "The content was changed somewhere else since you opened this page. Press Export to keep your edits, then reload to see the latest version." };
      const previous = current?.data?.[SITE_KEY];
      const saved = await writeSlice(current, { site: content, ...(previous ? { backup: previous } : {}) }, version);   /* previous version kept for one-step undo */
      if (!saved) return { ok: false, conflict: true, error: "The content was changed somewhere else while saving. Press Export to keep your edits, then reload." };
      revalidatePath("/");
      return { ok: true, version: saved.updated_at, hasBackup: !!previous };
    }
    if (!canWrite()) return { ok: false, error: "Database storage (Supabase) is not configured on this server, so changes can't be saved here." };
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2) + "\n", "utf-8");
    revalidatePath("/");
    return { ok: true, version: null, hasBackup: false };
  } catch (e: any) {
    return { ok: false, error: e.message || "Save failed" };
  }
}

/* put back the version that was live before the last save (the current one becomes the new "previous") */
export async function restorePreviousContent() {
  try {
    await requireAdmin();
    if (!sbConfig()) throw new Error("Database storage is not configured.");
    const current = await readRow();
    const backup = current?.data?.[BACKUP_KEY];
    if (!backup) throw new Error("There is no previous version to restore yet.");
    const saved = await writeSlice(current, { site: backup, backup: current?.data?.[SITE_KEY] ?? bundledContent }, current!.updated_at);
    if (!saved) throw new Error("The content was changed somewhere else while restoring. Reload and try again.");
    revalidatePath("/");
    return { ok: true, content: mergeContent(bundledContent, backup), version: saved.updated_at, hasBackup: true };
  } catch (e: any) {
    return { ok: false, error: e.message || "Restore failed" };
  }
}

function r2() {
  const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT, accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID, secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  if (!endpoint || !accessKeyId || !secretAccessKey) throw new Error("Cloudflare R2 is not configured on this server.");
  return new S3Client({ region: "auto", endpoint, credentials: { accessKeyId, secretAccessKey } });
}

/* images and videos go to the Cloudflare R2 bucket and come back as a public URL */
export async function uploadAsset(formData: FormData) {
  try {
    await requireAdmin();
    const file = formData.get("file"), kind = String(formData.get("kind") || "image");
    if (!(file instanceof File)) throw new Error("No file provided.");
    if (!file.type.startsWith(kind === "video" ? "video/" : "image/")) throw new Error(`Please choose ${kind === "video" ? "a video" : "an image"} file.`);
    const base = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
    if (!base) throw new Error("Cloudflare R2 public URL is not configured.");
    const key = `applications/site/${kind === "video" ? "videos" : "images"}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    await r2().send(new PutObjectCommand({ Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || "gg-content", Key: key, Body: Buffer.from(await file.arrayBuffer()), ContentType: file.type, CacheControl: "public, max-age=31536000, immutable" }));
    return { ok: true, url: `${base}/${key}` };
  } catch (e: any) {
    return { ok: false, error: e.message || "Upload failed" };
  }
}

/* ---------- form submissions (Contact + Pitch us) ----------
   They live in the same Supabase `inquiries` table the previous site used, so earlier submissions show up here too.
   Reading and deleting happen on the server, behind the admin login. Set SUPABASE_SERVICE_ROLE_KEY (server only) so the table
   can be locked down in Supabase; without it the public anon key is used, exactly like the old admin did. */
const sb = sbConfig;

export async function getSubmissions() {
  try {
    await requireAdmin();
    const c = sb();
    if (!c) return { ok: false as const, notConfigured: true, error: "Form storage (Supabase) is not configured on this server, so submissions can't be listed here." };
    const r = await fetch(`${c.url}/rest/v1/inquiries?select=*&order=created_at.desc&limit=500`, { headers: c.headers, cache: "no-store" });
    if (!r.ok) throw new Error(`Could not load submissions (${r.status}). ${(await r.text()).slice(0, 160)}`);
    return { ok: true as const, rows: (await r.json()) as any[] };
  } catch (e: any) {
    return { ok: false as const, error: e.message || "Could not load submissions" };
  }
}

export async function deleteSubmission(id: string | number) {
  try {
    await requireAdmin();
    const c = sb();
    if (!c) throw new Error("Form storage (Supabase) is not configured on this server.");
    const r = await fetch(`${c.url}/rest/v1/inquiries?id=eq.${encodeURIComponent(String(id))}`, { method: "DELETE", headers: { ...c.headers, Prefer: "return=minimal" } });
    if (!r.ok) throw new Error(`Could not delete (${r.status}). ${(await r.text()).slice(0, 160)}`);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message || "Delete failed" };
  }
}

/* ---------- big uploads: the browser sends the file straight to Cloudflare R2 with a short-lived signed link ----------
   (a file sent through this server would hit Vercel's ~4.5 MB request limit). Needs the CORS rule in cloudflare/r2-cors.json on the bucket. */
const MAX_BYTES = { image: 25 * 1024 * 1024, video: 600 * 1024 * 1024 } as const;
export async function getUploadUrl(name: string, type: string, kind: "image" | "video", size: number) {
  try {
    await requireAdmin();
    if (kind !== "image" && kind !== "video") throw new Error("Unknown file kind.");
    if (!type.startsWith(kind + "/")) throw new Error(`Please choose ${kind === "video" ? "a video" : "an image"} file.`);
    if (!(size > 0) || size > MAX_BYTES[kind]) throw new Error(`That file is too large. The limit is ${Math.round(MAX_BYTES[kind] / 1048576)} MB for ${kind === "video" ? "videos" : "images"}.`);
    const base = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
    if (!base) throw new Error("Cloudflare R2 public URL is not configured.");
    const safe = name.replace(/[^A-Za-z0-9._-]+/g, "-").slice(-120);
    const key = `applications/site/${kind === "video" ? "videos" : "images"}/${Date.now()}-${safe}`;
    const uploadUrl = await getSignedUrl(r2(), new PutObjectCommand({ Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME || "gg-content", Key: key, ContentType: type }), { expiresIn: 900 });
    return { ok: true, uploadUrl, publicUrl: `${base}/${key}` };
  } catch (e: any) {
    return { ok: false, error: e.message || "Could not prepare the upload" };
  }
}
