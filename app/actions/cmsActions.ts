"use server";

import fs from "fs/promises";
import path from "path";

export async function getCMSData() {
    const filePath = path.join(process.cwd(), "app/cms-data.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    return JSON.parse(jsonData);
}

export async function saveCMSData(data: any) {
    const filePath = path.join(process.cwd(), "app/cms-data.json");
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return { success: true };
}

export async function getInquiries() {
    try {
        const filePath = path.join(process.cwd(), "app/inquiries.json");
        const jsonData = await fs.readFile(filePath, "utf-8");
        return JSON.parse(jsonData);
    } catch (e) {
        return [];
    }
}

export async function saveInquiry(inquiry: any) {
    const filePath = path.join(process.cwd(), "app/inquiries.json");
    const inquiries = await getInquiries();
    inquiries.push({
        ...inquiry,
        id: Date.now(),
        date: new Date().toISOString()
    });
    await fs.writeFile(filePath, JSON.stringify(inquiries, null, 2), "utf-8");
    return { success: true };
}
