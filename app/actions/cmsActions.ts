"use server";

import { supabase } from "../utils/supabase";
import { DEFAULT_CONTENT } from "../data/defaultContent";
import { FullCMSContent } from "../types/cms";

/**
 * Fetches all content from the 'content_sections' table in Supabase.
 * If data is missing or Supabase is offline, falls back to DEFAULT_CONTENT.
 */
export async function getCMSData(): Promise<FullCMSContent> {
    if (!supabase) {
        console.warn("Supabase not configured. Using default content.");
        return DEFAULT_CONTENT;
    }

    try {
        const { data: rows, error } = await supabase
            .from("content_sections")
            .select("section_key, content");

        if (error) {
            console.error("Supabase fetch error:", error);
            return DEFAULT_CONTENT;
        }

        // Convert rows (key-value pairs) into a single object
        const dbContent: any = {};
        rows.forEach((row: any) => {
            dbContent[row.section_key] = row.content;
        });

        // Merge DB content over Default content to ensure structure exists
        // This allows us to have new fields in code that might not be in DB yet
        return deepMerge(DEFAULT_CONTENT, dbContent) as FullCMSContent;

    } catch (error) {
        console.error("Unexpected error fetching CMS data:", error);
        return DEFAULT_CONTENT;
    }
}

/**
 * Saves the full CMS content state to Supabase.
 * Breaks the big object into sections and upserts them independently.
 */
export async function saveCMSData(data: any): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
        return {
            success: false,
            error: "Supabase client not initialized. Check your .env.local file and restart the development server."
        };
    }

    try {
        // We break the huge JSON object into smaller chunks (sections)
        // capable of being stored in our 'content_sections' table.
        const updates = [
            { section_key: 'home', content: data.home },
            { section_key: 'principles', content: data.principles },
            { section_key: 'business', content: data.business },
            { section_key: 'services', content: data.services }, // Saving services list as JSON
            { section_key: 'people', content: data.people },     // Saving people list as JSON
            { section_key: 'contact', content: data.contact },
        ];

        // Check if 'technologies' or 'cases' exist in incoming data (from your admin tool)
        // If you added new tabs to the admin, add them here to persist them.
        if (data.technologies) updates.push({ section_key: 'technologies', content: data.technologies });
        if (data.cases) updates.push({ section_key: 'cases', content: data.cases });

        const { error } = await supabase
            .from('content_sections')
            .upsert(updates, { onConflict: 'section_key' });

        if (error) throw error;

        return { success: true };
    } catch (err: any) {
        console.error("Error saving to Supabase:", err);
        return { success: false, error: err.message };
    }
}

/**
 * Resets the database content to match the hardcoded DEFAULT_CONTENT.
 */
export async function resetToDefault(): Promise<{ success: boolean; error?: string }> {
    return saveCMSData(DEFAULT_CONTENT);
}

/**
 * Helper to deep merge objects (Target = Default, Source = DB)
 */
function deepMerge(target: any, source: any): any {
    if (typeof target !== 'object' || target === null) {
        return source !== undefined ? source : target;
    }

    if (Array.isArray(target)) {
        // Ideally we trust the DB array. If DB has the array, use it.
        return Array.isArray(source) ? source : target;
    }

    const output = { ...target };
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

function isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
