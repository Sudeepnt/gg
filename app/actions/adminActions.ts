"use server";

import { supabase } from "../utils/supabase";

export async function getContactSubmissions() {
    if (!supabase) return [];

    try {
        const { data, error } = await supabase
            .from("contact_submissions")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching submissions:", error);
            return [];
        }

        return data;
    } catch (error) {
        console.error("Unexpected error:", error);
        return [];
    }
}
