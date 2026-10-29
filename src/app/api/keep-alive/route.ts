import { NextResponse } from "next/server";

// Vercel cron (see vercel.json): logs a heartbeat row so the free Supabase project does not pause.
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ success: false, error: "Supabase env vars missing" }, { status: 500 });
  try {
    const r = await fetch(`${url}/rest/v1/project_heartbeat`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ message: "hi" }),
    });
    if (!r.ok) return NextResponse.json({ success: false, error: await r.text() }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
  }
}
