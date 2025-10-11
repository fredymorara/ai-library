import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";
import { processFileForChunks, getEmbedding } from '@/lib/pdf-processor';
import { processCsvForChunks } from '@/lib/csv-processor';
import { insertVectors } from '@/lib/vector-store';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    // 1. Authentication
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();

    // 2. Get Institution ID
    const { data: institution } = await supabase
      .from('institutions')
      .select('id')
      .eq('clerk_org_id', orgId)
      .single();

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found.' }, { status: 404 });
    }
    const institutionId = institution.id;

    // 3. Fetch non-ingested books
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, title, author, file_name')
      .eq('institution_id', institutionId)
      .eq('is_ingested', false);

    if (booksError) {
      return NextResponse.json({ error: 'Failed to fetch books for ingestion.', details: booksError.message }, { status: 500 });
    }

    if (!books || books.length === 0) {
      return NextResponse.json({ message: 'All books are already ingested.' });
    }

    // 4. Process each book
    for (const book of books) {
      let chunks = [];
      
      if (book.file_name) {
        // --- PDF/File Processing ---
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('library-files')
          .download(book.file_name);

        if (downloadError) {
          console.error(`Failed to download file ${book.file_name} for book ${book.id}:`, downloadError);
          continue; // Skip to next book
        }
        
        const fileBuffer = Buffer.from(await fileData.arrayBuffer());
        chunks = await processFileForChunks(fileBuffer);

      } else {
        // --- CSV-based Book Processing ---
        const csvRowContent = JSON.stringify({ title: book.title, author: book.author });
        chunks = [csvRowContent];
      }

      // 5. Generate Embeddings
      const embeddings = await Promise.all(chunks.map(chunk => getEmbedding(chunk)));

      // 6. Insert into vector store
      await insertVectors(book.id, institutionId, chunks, embeddings);

      // 7. Mark book as ingested
      await supabase
        .from('books')
        .update({ is_ingested: true })
        .eq('id', book.id);
    }

    return NextResponse.json({ message: `Successfully ingested ${books.length} new book(s).` });

  } catch (e) {
    console.error('Error during chatbot preparation:', e);
    return NextResponse.json({ error: 'Internal server error during ingestion.', details: e.message }, { status: 500 });
  }
}
