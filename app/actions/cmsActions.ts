"use server";

import fs from "fs/promises";
import path from "path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { supabase } from "../lib/supabase";

// Helper to get local factory defaults
async function getLocalDefaults() {
    try {
        const filePath = path.join(process.cwd(), "app/cms-defaults.json");
        const jsonData = await fs.readFile(filePath, "utf-8");
        return JSON.parse(jsonData);
    } catch (e) {
        // Fallback to cms-data.json if defaults file is missing
        const filePath = path.join(process.cwd(), "app/cms-data.json");
        const jsonData = await fs.readFile(filePath, "utf-8");
        return JSON.parse(jsonData);
    }
}

// Local cache to make data access feel instant
let cmsCache: any = null;

export async function getCMSData() {
    if (cmsCache) {
        revalidateCMSCache();
        return cmsCache;
    }

    try {
        console.log("Fetching CMS data from Supabase...");
        const { data, error } = await supabase
            .from('cms_settings')
            .select('data')
            .eq('id', 1)
            .maybeSingle();

        const localDefaults = await getLocalDefaults();

        if (error) {
            console.error("Supabase Query Error:", error.message);
            cmsCache = localDefaults;
            return localDefaults;
        }

        if (!data) {
            console.log("Database table is empty, seeding from defaults...");
            await supabase.from('cms_settings').upsert({
                id: 1,
                data: localDefaults,
                default_data: localDefaults
            });
            cmsCache = localDefaults;
            return localDefaults;
        }

        console.log("Successfully fetched overrides from Supabase.");
        const mergedData = mergeCMSData(localDefaults, data.data);
        cmsCache = mergedData;
        return mergedData;
    } catch (e: any) {
        console.error("Critical Fetch Error:", e.message);
        return await getLocalDefaults();
    }
}

async function revalidateCMSCache() {
    try {
        const { data, error } = await supabase.from('cms_settings').select('data').eq('id', 1).maybeSingle();
        if (data && !error) {
            const localDefaults = await getLocalDefaults();
            cmsCache = mergeCMSData(localDefaults, data.data);
            console.log("Background cache revalidation successful.");
        }
    } catch (e: any) {
        console.error("Background revalidation failed:", e.message);
    }
}

// Deep merge helper to combine local defaults with Supabase overrides
function mergeCMSData(base: any, overrides: any) {
    const result = { ...base };
    for (const key in overrides) {
        if (overrides[key] && typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
            result[key] = mergeCMSData(base[key] || {}, overrides[key]);
        } else {
            result[key] = overrides[key];
        }
    }
    return result;
}


export async function saveCMSData(newData: any) {
    try {
        // First, check if the row exists to preserve default_data
        const { data: existingData } = await supabase
            .from('cms_settings')
            .select('default_data')
            .eq('id', 1)
            .maybeSingle();

        const localDefaults = await getLocalDefaults();
        const defaultData = existingData?.default_data || localDefaults;

        const { error } = await supabase
            .from('cms_settings')
            .upsert({
                id: 1,
                data: newData,
                default_data: defaultData,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;

        // Update local cache
        cmsCache = newData;

        // Backup to local file only in development (Vercel is read-only)
        if (process.env.NODE_ENV !== 'production') {
            try {
                const filePath = path.join(process.cwd(), "app/cms-data.json");
                await fs.writeFile(filePath, JSON.stringify(newData, null, 2), "utf-8");
            } catch (backupError) {
                console.error("Local backup failed (skipping):", backupError);
            }
        }

        return { success: true };
    } catch (e: any) {
        console.error("Critical Save Error:", e);
        return { success: false, error: { message: e.message || "Unknown error" } };
    }
}

export async function resetPageToDefault(pageKey: string) {
    try {
        console.log(`Resetting section [${pageKey}] to factory defaults...`);
        const localDefaults = await getLocalDefaults();

        // Fetch the full existing row to preserve default_data and other sections
        const { data: existingRow, error: fetchError } = await supabase
            .from('cms_settings')
            .select('*')
            .eq('id', 1)
            .maybeSingle();

        if (fetchError) throw fetchError;

        // Base the new data on existing data if it exists, otherwise use defaults
        const currentData = existingRow?.data || localDefaults;
        const defaultData = existingRow?.default_data || localDefaults;

        // Apply the factory reset for the specific page
        const updatedData = { ...currentData };
        updatedData[pageKey] = localDefaults[pageKey];

        const { error: upsertError } = await supabase
            .from('cms_settings')
            .upsert({
                id: 1,
                data: updatedData,
                default_data: defaultData,
                updated_at: new Date().toISOString()
            });

        if (upsertError) throw upsertError;

        // Update local cache for instant UI feedback across the app
        cmsCache = updatedData;

        console.log(`Section [${pageKey}] reset successful.`);
        return { success: true, data: updatedData };
    } catch (e: any) {
        console.error("Critical Reset Error:", e.message);
        return { success: false, error: e.message };
    }
}

export async function getInquiries() {
    try {
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (e) {
        console.error("Supabase inquiries fetch failed:", e);
        return [];
    }
}

export async function deleteInquiry(id: any) {
    try {
        console.log("Attempting to delete inquiry with ID:", id);
        const { error } = await supabase
            .from('inquiries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Supabase delete error object:", error);
            throw error;
        }
        console.log("Delete successful for ID:", id);
        return { success: true };
    } catch (e: any) {
        console.error("Supabase inquiry delete failed exception:", e.message);
        return { success: false, error: e.message };
    }
}

export async function saveInquiry(inquiry: any) {
    try {
        console.log("Saving new inquiry...", inquiry.email);
        const { error } = await supabase
            .from('inquiries')
            .insert([{
                name: inquiry.name,
                email: inquiry.email,
                message: inquiry.message,
                data: inquiry
            }]);

        if (error) {
            console.error("Supabase insert error:", error);
            throw error;
        }
        return { success: true };
    } catch (e: any) {
        console.error("Supabase inquiry save failed:", e.message);
        return { success: false, error: e.message };
    }
}

export async function dbHeartbeat() {
    try {
        // Match the schema provided: id, last_ping, message
        const { error } = await supabase.from('heartbeat').upsert({
            id: 1,
            last_ping: new Date().toISOString(),
            message: "ping"
        });
        if (error) throw error;
        return { success: true };
    } catch (e) {
        console.error("Heartbeat failed:", e);
        return { success: false };
    }
}

function getR2Client() {
    const endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

    if (!endpoint || !accessKeyId || !secretAccessKey) {
        throw new Error("Cloudflare R2 configuration is missing.");
    }

    return new S3Client({
        region: "auto",
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    });
}

function getR2PublicBaseUrl() {
    const publicBaseUrl = process.env.CLOUDFLARE_R2_PUBLIC_BASE_URL;
    if (!publicBaseUrl) {
        throw new Error("Cloudflare R2 public base URL is missing.");
    }
    return publicBaseUrl.replace(/\/$/, "");
}

export async function uploadCMSReelToR2(formData: FormData) {
    try {
        const file = formData.get("file");
        const keyPrefix = String(formData.get("keyPrefix") || "applications/hero-reels");
        const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME || "gg-content";

        if (!(file instanceof File)) {
            throw new Error("No file provided.");
        }

        if (!file.type.startsWith("video/")) {
            throw new Error("Please upload a video file.");
        }

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const objectKey = `${keyPrefix}/${fileName}`;
        const arrayBuffer = await file.arrayBuffer();

        await getR2Client().send(new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            Body: Buffer.from(arrayBuffer),
            ContentType: file.type,
            CacheControl: "public, max-age=31536000, immutable"
        }));

        return {
            success: true,
            publicUrl: `${getR2PublicBaseUrl()}/${objectKey}`
        };
    } catch (e: any) {
        console.error("R2 reel upload failed:", e);
        return {
            success: false,
            error: e.message || "Unknown R2 upload error"
        };
    }
}
