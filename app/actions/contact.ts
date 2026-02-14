"use server";

import { supabase } from "../utils/supabase";

export async function submitContactForm(formData: { name: string; email: string; message?: string; phone?: string }) {
    if (!supabase) {
        return { success: false, error: "System configuration error. Please try again later." };
    }

    try {
        const { error } = await supabase
            .from("contact_submissions")
            .insert([
                {
                    name: formData.name,
                    email: formData.email
                }
            ]);

        if (error) {
            console.error("Supabase insert error:", error);
            return { success: false, error: "Failed to submit form. Please try again." };
        }

        return { success: true };
    } catch (error) {
        console.error("Unexpected error:", error);
        return { success: false, error: "An unexpected error occurred." };
    }
}
