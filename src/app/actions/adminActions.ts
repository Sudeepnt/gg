"use server";

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/* Admin back end for the current site. No database: content is one JSON file (src/content/site-content.json).
   Saving writes that file when the server's disk is writable (local dev / any normal server). On Vercel the disk is
   read-only, so the dashboard offers Export instead; swap saveSiteContent for a database later without touching the UI. */

const CONTENT_FILE = path.join(process.cwd(), "src/content/site-content.json");
const PASSWORD = process.env.ADMIN_PASSWORD || "gg5656";
const SECRET = process.env.ADMIN_SECRET || "gg-admin-secret-change-me";
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

export async function getSiteContent() {
  try {
    await requireAdmin();
    const content = JSON.parse(await fs.readFile(CONTENT_FILE, "utf-8"));
    return { ok: true as const, content, canSave: canWrite() };
  } catch (e: any) {
    return { ok: false as const, error: e.message || "Could not load content" };
  }
}

export async function saveSiteContent(content: any) {
  try {
    await requireAdmin();
    if (!content || typeof content !== "object" || !Array.isArray(content.games) || !Array.isArray(content.news)) throw new Error("That does not look like site content.");
    if (!canWrite()) return { ok: false, error: "This server's disk is read-only, so changes can't be saved here. Use Export JSON and replace src/content/site-content.json in the project, then redeploy." };
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2) + "\n", "utf-8");
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message || "Save failed" };
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
