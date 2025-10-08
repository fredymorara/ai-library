// src/app/api/get-books/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

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

    const { data: institution } = await supabaseAdmin.from('institutions').select('id').eq('clerk_user_id', userId).single();

    if (!institution) {
      // If they have no institution, they have no books. Return an empty list.
      return NextResponse.json([]);
    }

    const { data: books, error: booksError } = await supabaseAdmin
      .from('books')
      .select('id, title, author')
      .eq('institution_id', institution.id)
      .order('created_at', { ascending: false });

    if (booksError) throw booksError;

    return NextResponse.json(books);

  } catch (error) {
    console.error('Error fetching books:', error);
    return new NextResponse(JSON.stringify({ error: error.message || "An internal server error occurred." }), { status: 500 });
  }
}