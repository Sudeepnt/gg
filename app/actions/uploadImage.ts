"use server";

import { supabase } from "../utils/supabase";

const PROTECTED_IMAGES = ["guru.jpeg", "utsav.jpeg"];

export async function uploadImage(formData: FormData): Promise<{ success: boolean; path?: string; error?: string }> {
    if (!supabase) {
        return { success: false, error: "Supabase not configured." };
    }

    try {
        const file = formData.get("file") as File;
        const memberName = formData.get("memberName") as string;

        if (!file) {
            return { success: false, error: "No file provided" };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a clean filename
        const cleanName = memberName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");

        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${cleanName}-${Date.now()}.${ext}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('uploads')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: true
            });

        if (error) {
            console.error("Supabase storage upload error:", error);
            return { success: false, error: "Failed to upload image." };
        }

        // Get Public URL
        const { data: publicUrlData } = supabase
            .storage
            .from('uploads')
            .getPublicUrl(filename);

        return { success: true, path: publicUrlData.publicUrl };

    } catch (err: any) {
        console.error("Error uploading image:", err);
        return { success: false, error: err.message };
    }
}

export async function deleteImage(imageUrl: string): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return { success: false, error: "Supabase not configured" };

    try {
        // Extract filename from URL
        // URL format: .../storage/v1/object/public/uploads/filename.jpg
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1];

        // Don't delete protected or default images
        if (PROTECTED_IMAGES.includes(filename) || !imageUrl.includes("supabase")) {
            return { success: true };
        }

        const { error } = await supabase
            .storage
            .from('uploads')
            .remove([filename]);

        if (error) {
            console.error("Supabase delete error:", error);
            // Don't fail the whole layout update if just an image delete fails
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Error deleting image:", err);
        return { success: false, error: err.message };
    }
}
