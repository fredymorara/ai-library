import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { books } = await request.json();
    if (!books || !Array.isArray(books) || books.length === 0) {
      return NextResponse.json({ error: 'No books provided in the request.' }, { status: 400 });
    }

    const serviceSupabase = createServiceRoleClient();

    // Ensure institution exists
    let { data: institution, error: institutionError } = await serviceSupabase
      .from('institutions')
      .select('id')
      .eq('clerk_org_id', orgId)
      .single();

    if (institutionError && institutionError.code !== 'PGRST116') {
      console.error('Institution fetch error:', institutionError);
      return NextResponse.json({ error: 'Failed to verify institution.' }, { status: 500 });
    }

    if (!institution) {
      const { data: newInstitution, error: createError } = await serviceSupabase
        .from('institutions')
        .insert({ clerk_org_id: orgId, name: orgId })
        .select('id')
        .single();
      if (createError) {
        console.error('Institution create error details:', createError);
        return NextResponse.json({ error: 'Failed to create institution record.' }, { status: 500 });
      }
      institution = newInstitution;
    }

    // Map books to insert payload
    const booksToInsert = books.map(book => ({
      title: book.title || book.Title || book.book_title || 'Unknown Title',
      author: book.author || book.Author || book.authors || book.book_author || 'Unknown Author',
      institution_id: institution.id,
      uploaded_by: userId,
      file_name: 'Bulk Upload',
      is_ingested: false,
    }));

    const { error: insertError } = await serviceSupabase
      .from('books')
      .insert(booksToInsert);

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save batch of books.', details: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: `Successfully inserted ${books.length} books.` });

  } catch (e) {
    console.error('Bulk upload error:', e);
    return NextResponse.json({ error: 'Internal server error.', details: e.message }, { status: 500 });
  }
}
