// src/app/api/delete-book/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('id');

    if (!bookId) {
      return new NextResponse(JSON.stringify({ error: "Book ID is required." }), { status: 400 });
    }

    // Verify the user owns the book they are trying to delete
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

    // Delete the book
    const { error: deleteError } = await supabaseAdmin
      .from('books')
      .delete()
      .eq('id', bookId);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return new NextResponse(JSON.stringify({ error: error.message || "An internal server error occurred." }), { status: 500 });
  }
}