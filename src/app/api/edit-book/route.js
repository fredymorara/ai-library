// src/app/api/edit-book/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

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

    const { bookId, title, author } = await req.json();

    if (!bookId || !title || !author) {
      return new NextResponse(JSON.stringify({ error: "Book ID, title, and author are required." }), { status: 400 });
    }

    // Verify the user owns the book they are trying to edit
    const { data: institution } = await supabaseAdmin.from('institutions').select('id').eq('clerk_user_id', userId).single();
    if (!institution) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { data: book, error: bookError } = await supabaseAdmin
      .from('books')
      .select('id, institution_id')
      .eq('id', bookId)
      .single();

    if (bookError || !book) {
      return new NextResponse(JSON.stringify({ error: "Book not found." }), { status: 404 });
    }

    if (book.institution_id !== institution.id) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    // Update the book
    const { error: updateError } = await supabaseAdmin
      .from('books')
      .update({ title, author })
      .eq('id', bookId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ message: 'Book updated successfully.' });
  } catch (error) {
    console.error('Error updating book:', error);
    return new NextResponse(JSON.stringify({ error: error.message || "An internal server error occurred." }), { status: 500 });
  }
}
