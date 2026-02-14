
import { NextResponse } from 'next/server';
import { supabase } from '../../../utils/supabase';

// This API route will be called by Vercel Cron
export async function GET(request: Request) {
    if (!supabase) {
        return NextResponse.json({ success: false, error: 'Supabase client not initialized' }, { status: 500 });
    }

    try {
        // Insert a "hi" message to keep the DB active
        // This counts as an API request and prevents pausing
        const { error } = await supabase
            .from('project_heartbeat')
            .insert([
                { message: 'hi' }
            ]);

        if (error) {
            console.error('Heartbeat failed:', error);
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Heartbeat logged successfully' });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
