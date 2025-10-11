import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";

export const runtime = 'nodejs';

// POST /api/admin/books/[book_id] (for editing)
export async function POST(request, { params }) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { book_id } = params;
    const { title, author } = await request.json();

    if (!book_id) {
      return NextResponse.json({ error: 'Book ID is required.' }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Verify ownership before editing
    const { data: book, error: fetchError } = await supabase
      .from('books')
      .select('id, institution_id')
      .eq('id', book_id)
      .single();

    if (fetchError || !book) {
      return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
    }

    const { data: institution } = await supabase
      .from('institutions')
      .select('id')
      .eq('clerk_org_id', orgId)
      .single();

    if (!institution || institution.id !== book.institution_id) {
      return NextResponse.json({ error: 'Forbidden. You do not have permission to edit this book.' }, { status: 403 });
    }

    // Update the book
    const { data: updatedBook, error: updateError } = await supabase
      .from('books')
      .update({ title, author: author || 'Unknown' })
      .eq('id', book.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update book.', details: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ book: updatedBook });

  } catch (e) {
    console.error('Error updating book:', e);
    return NextResponse.json({ error: 'Internal server error.', details: e.message }, { status: 500 });
  }
}

// DELETE /api/admin/books/[book_id]
export async function DELETE(request, { params }) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { book_id } = params;
    if (!book_id) {
      return NextResponse.json({ error: 'Book ID is required.' }, { status: 400 });
    }

    const supabase = createServiceRoleClient();

    // Verify the book belongs to the user's institution before deleting
    const { data: book, error: fetchError } = await supabase
      .from('books')
      .select('id, institution_id, file_name')
      .eq('id', book_id)
      .single();

    if (fetchError || !book) {
      return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
    }

    // This part is crucial for security in a multi-tenant app
    const { data: institution } = await supabase
      .from('institutions')
      .select('id')
      .eq('clerk_org_id', orgId)
      .single();

    if (!institution || institution.id !== book.institution_id) {
      return NextResponse.json({ error: 'Forbidden. You do not have permission to delete this book.' }, { status: 403 });
    }

    // Delete the book record from the database
    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .eq('id', book.id);

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete book.', details: deleteError.message }, { status: 500 });
    }

    // If the book had an associated file, delete it from storage
    if (book.file_name) {
      const { error: storageError } = await supabase.storage
        .from('library-files')
        .remove([book.file_name]);
      
      if (storageError) {
        // Log the error but don't block the success response, as the primary record is gone
        console.warn(`Failed to delete file from storage: ${book.file_name}`, storageError);
      }
    }

    return NextResponse.json({ message: 'Book deleted successfully.' });

  } catch (e) {
    console.error('Error deleting book:', e);
    return NextResponse.json({ error: 'Internal server error.', details: e.message }, { status: 500 });
  }
}
