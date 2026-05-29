import { NextResponse } from 'next/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";

export const runtime = 'edge'; // Edge is faster and cheaper for simple pings

export async function GET(request) {
  try {
    // 1. Verify Vercel Cron authentication (Optional but highly recommended)
    // Vercel automatically sends the CRON_SECRET as a Bearer token
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    // 2. Initialize Supabase client
    const supabase = createServiceRoleClient();

    // 3. Ping the database with a tiny, fast query to register activity
    const { data, error } = await supabase
      .from('institutions')
      .select('id')
      .limit(1);

    if (error) {
      console.error("Keep-alive ping failed:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 4. Return success
    console.log("Supabase keep-alive ping successful.");
    return NextResponse.json({ success: true, message: "Database pinged successfully to prevent pausing." });
    
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
