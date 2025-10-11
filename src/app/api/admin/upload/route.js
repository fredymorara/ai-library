import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";
import { v4 as uuidv4 } from 'uuid';
import { isAllowedFileType } from '@/lib/utils';
import Papa from 'papaparse';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    // 1. Authentication Check
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Institution Lookup/Creation
    const serviceSupabase = createServiceRoleClient();
    let { data: institution, error: institutionError } = await serviceSupabase
      .from('institutions')
      .select('id')
      .eq('clerk_org_id', orgId)
      .single();

    if (institutionError && institutionError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Failed to verify institution.' }, { status: 500 });
    }

    if (!institution) {
      const { data: newInstitution, error: createError } = await serviceSupabase
        .from('institutions')
        .insert({ clerk_org_id: orgId, name: orgId })
        .select('id')
        .single();
      if (createError) {
        return NextResponse.json({ error: 'Failed to create institution record.' }, { status: 500 });
      }
      institution = newInstitution;
    }
    const institutionId = institution.id;

    // 3. File Processing
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const filename = file.name;
    const fileExtension = filename.split('.').pop()?.toLowerCase();

    if (!fileExtension || !isAllowedFileType(fileExtension)) {
      return NextResponse.json({ error: `File type .${fileExtension || 'unknown'} is not allowed.` }, { status: 400 });
    }

    // 4. Handle File Based on Type
    if (fileExtension === 'csv') {
      // --- CSV Processing ---
      const fileContent = await file.text();
      const parsedCsv = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

      if (parsedCsv.errors.length) {
        return NextResponse.json({ error: 'Failed to parse CSV file.', details: parsedCsv.errors }, { status: 400 });
      }

      if (!parsedCsv.meta.fields.includes('title')) {
        return NextResponse.json({ error: 'CSV must have a "title" column.' }, { status: 400 });
      }

      const booksToInsert = parsedCsv.data
        .filter(row => row.title) // Ensure title is present
        .map(row => ({
          institution_id: institutionId,
          title: row.title,
          author: row.author || 'Unknown', // Default author if not present
          uploaded_by: userId,
          is_ingested: false,
        }));

      if (booksToInsert.length === 0) {
        return NextResponse.json({ error: 'No valid books found in the CSV file.' }, { status: 400 });
      }

      const { error: insertError } = await serviceSupabase.from('books').insert(booksToInsert);

      if (insertError) {
        return NextResponse.json({ error: 'Failed to save books from CSV.', details: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ message: `Successfully added ${booksToInsert.length} books to your library.` });

    } else {
      // --- PDF/Other File Processing ---
      const storagePath = `${institutionId}/${uuidv4()}-${filename}`;
      
      const { error: uploadError } = await serviceSupabase.storage
        .from('library-files')
        .upload(storagePath, file);

      if (uploadError) {
        return NextResponse.json({ error: 'Failed to upload file to storage.', details: uploadError.message }, { status: 500 });
      }

      const { error: insertError } = await serviceSupabase.from('books').insert({
        institution_id: institutionId,
        title: filename.replace(`.${fileExtension}`, ''),
        author: 'Unknown',
        file_name: storagePath,
        is_ingested: false,
        uploaded_by: userId,
      });

      if (insertError) {
        await serviceSupabase.storage.from('library-files').remove([storagePath]);
        return NextResponse.json({ error: 'Failed to record book metadata.', details: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ message: `Successfully added "${filename}" to your library. Ready for ingestion.` });
    }

  } catch (e) {
    console.error('Unhandled error in upload handler:', e);
    return NextResponse.json({ error: 'Internal server error.', details: e.message }, { status: 500 });
  }
}