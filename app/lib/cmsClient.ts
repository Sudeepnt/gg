"use client";

import cmsDefaults from "../cms-defaults.json";
import { supabase } from "./supabase";

let cachedData: any = null;
let pendingRequest: Promise<any> | null = null;

function mergeCMSData(base: any, overrides: any) {
    const result = { ...base };
    for (const key in overrides || {}) {
        if (overrides[key] && typeof overrides[key] === "object" && !Array.isArray(overrides[key])) {
            result[key] = mergeCMSData(base?.[key] || {}, overrides[key]);
        } else {
            result[key] = overrides[key];
        }
    }
    return result;
}

export async function getCMSDataClient() {
    if (cachedData) return cachedData;

    if (pendingRequest) return pendingRequest;

    pendingRequest = (async () => {
        try {
            const { data, error } = await supabase
                .from("cms_settings")
                .select("data")
                .eq("id", 1)
                .maybeSingle();

            if (error) {
                console.error("Client CMS fetch failed:", error.message);
                cachedData = cmsDefaults;
                return cmsDefaults;
            }

            const mergedData = mergeCMSData(cmsDefaults, data?.data || {});
            cachedData = mergedData;
            return mergedData;
        } catch (error) {
            console.error("Client CMS fetch failed:", error);
            cachedData = cmsDefaults;
            return cmsDefaults;
        } finally {
            pendingRequest = null;
        }
    })();

    return pendingRequest;
}

export function getCachedCMSData() {
    return cachedData;
}
