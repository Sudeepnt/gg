"use client";

import { getCMSData as getCMSDataServer } from "../actions/cmsActions";

let cachedData: any = null;
let pendingRequest: Promise<any> | null = null;

export async function getCMSDataClient() {
    if (cachedData) return cachedData;

    if (pendingRequest) return pendingRequest;

    pendingRequest = (async () => {
        try {
            const data = await getCMSDataServer();
            cachedData = data;
            return data;
        } finally {
            pendingRequest = null;
        }
    })();

    return pendingRequest;
}

export function getCachedCMSData() {
    return cachedData;
}
