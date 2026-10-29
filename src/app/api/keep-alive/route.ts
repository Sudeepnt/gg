import { NextResponse } from "next/server";
import { sbConfig } from "@/lib/supabaseRest";

// Vercel cron (see vercel.json): pings the `heartbeat` table (row 1, like the previous site) so the Supabase project does not pause.
export const dynamic = "force-dynamic";

export async function GET() {
  const c = sbConfig();
  if (!c) return NextResponse.json({ success: false, error: "Supabase env vars missing" }, { status: 500 });
  try {
    const r = await fetch(`${c.url}/rest/v1/heartbeat?on_conflict=id`, {
      method: "POST",
      headers: { ...c.headers, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ id: 1, last_ping: new Date().toISOString(), message: "ping" }),
    });
    if (!r.ok) return NextResponse.json({ success: false, error: await r.text() }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
  }
}
