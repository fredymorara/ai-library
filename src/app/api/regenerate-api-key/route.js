// src/app/api/regenerate-api-key/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { data: institution, error: institutionError } = await supabaseAdmin
      .from('institutions')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (institutionError || !institution) {
      return new NextResponse(JSON.stringify({ error: "Institution not found." }), { status: 404 });
    }

    const newApiKey = `sk-${uuidv4()}`;

    const { error: updateError } = await supabaseAdmin
      .from('institutions')
      .update({ api_key: newApiKey })
      .eq('id', institution.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ apiKey: newApiKey });
  } catch (error) {
    console.error('Error regenerating API key:', error);
    return new NextResponse(JSON.stringify({ error: error.message || "An internal server error occurred." }), { status: 500 });
  }
}
