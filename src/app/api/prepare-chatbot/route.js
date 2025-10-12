import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";
import { getEmbedding } from '@/lib/embedding-generator'; // We will create this new file
import wikipedia from 'wikipedia';

export const runtime = 'nodejs';

async function getWikipediaSummary(title, author) {
  try {
    const simpleTitle = title.split('(')[0].strip();
    const mainAuthor = author.split('/')[0].strip();
    const query = `${simpleTitle} (${mainAuthor})`;
    const summary = await wikipedia.summary(query, { autoSuggest: true });
    return summary;
  } catch (error) {
    // console.warn(`Wikipedia lookup failed for "${title}":`, error.message);
    return null;
  }
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(request) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    const { data: institution } = await supabase.from('institutions').select('id').eq('clerk_org_id', orgId).single();
    if (!institution) {
      return NextResponse.json({ error: 'Institution not found.' }, { status: 404 });
    }
    const institutionId = institution.id;

    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, title, author')
      .eq('institution_id', institutionId)
      .eq('is_ingested', false)
      .limit(5);

    if (booksError) {
      return NextResponse.json({ error: 'Failed to fetch books for ingestion.' }, { status: 500 });
    }
    if (!books || books.length === 0) {
      return NextResponse.json({ message: 'All books are already ingested.' });
    }

    for (const book of books) {
      const baseInfo = `Title: ${book.title}. Author: ${book.author}.`;
      const summary = await getWikipediaSummary(book.title, book.author);
      const documentText = summary ? `${baseInfo} Summary: ${summary}` : baseInfo;

      const embedding = await getEmbedding(documentText);

      await supabase.from('book_vectors').insert({
        book_id: book.id,
        institution_id: institutionId,
        content: documentText,
        embedding: embedding,
      });

      await supabase.from('books').update({ is_ingested: true }).eq('id', book.id);
      
      await sleep(1000); // Be polite to the Wikipedia API
    }

    return NextResponse.json({ message: `Successfully ingested ${books.length} new book(s).` });

  } catch (e) {
    console.error('Error during chatbot preparation:', e);
    return NextResponse.json({ error: 'Internal server error during ingestion.', details: e.message }, { status: 500 });
  }
}