// src/app/api/institution/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// The secure, server-side admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 1. Try to find the institution
    let { data: institution, error: selectError } = await supabaseAdmin
      .from('institutions')
      .select('*') // Select all columns
      .eq('clerk_user_id', userId)
      .single();

    // 2. If not found, create it "Just-In-Time"
    if (!institution) {
      console.log(`Institution not found for user ${userId}. Creating one now.`);
      const newApiKey = `sk-${uuidv4()}`;
      const { data: newInstitution, error: createError } = await supabaseAdmin
        .from('institutions')
        .insert({ clerk_user_id: userId, api_key: newApiKey, name: 'New Institution' })
        .select('*')
        .single();
      
      if (createError) throw createError;
      institution = newInstitution;
    }

    // 3. Return the full institution details
    return NextResponse.json(institution);

  } catch (error) {
    console.error('Error in /api/institution:', error);
    return new NextResponse(JSON.stringify({ error: error.message || "An internal server error occurred." }), { status: 500 });
  }
}