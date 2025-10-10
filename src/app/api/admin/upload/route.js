import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServiceRoleClient } from "@/lib/supabase/server-client";
import { v4 as uuidv4 } from 'uuid';
import { insertVectors } from '@/lib/vector-store';
import { isAllowedFileType } from '@/lib/utils';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    // 1. Authentication Check - Admin must be logged in
    const { userId, orgId } = await auth();

    console.log("--- ADMIN UPLOAD AUTH CHECK ---");
    console.log(`- userId: ${userId ? 'PRESENT' : 'MISSING'}`);
    console.log(`- orgId: ${orgId ? 'PRESENT' : 'MISSING'}`);

    if (!userId) {
      console.error("ERROR: 401 Unauthorized - Admin must be logged in.");
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    // 2. Organization Check - Admin must belong to an institution
    if (!orgId) {
      console.error("ERROR: 403 Forbidden - Admin must belong to an institution.");
      return NextResponse.json(
        { error: "Access Forbidden: You must belong to an institution to upload books. Please contact support to set up your institution." }, 
        { status: 403 }
      );
    }

    const serviceSupabase = createServiceRoleClient();

    // 3. Map Clerk orgId to institution_id in your database
    // First, check if institution exists, if not create it
    let { data: institution, error: institutionError } = await serviceSupabase
      .from('institutions')
      .select('id')
      .eq('clerk_org_id', orgId)
      .single();

    if (institutionError && institutionError.code !== 'PGRST116') { // PGRST116 = not found
      console.error("Institution lookup error:", institutionError);
      return NextResponse.json({ error: 'Failed to verify institution.' }, { status: 500 });
    }

    // If institution doesn't exist, create it
    if (!institution) {
      const { data: newInstitution, error: createError } = await serviceSupabase
        .from('institutions')
        .insert({
          clerk_org_id: orgId,
          name: orgId, // You can get actual org name from Clerk if needed
        })
        .select()
        .single();

      if (createError) {
        console.error("Institution creation error:", createError);
        return NextResponse.json({ error: 'Failed to create institution record.' }, { status: 500 });
      }

      institution = newInstitution;
    }

    const institutionId = institution.id;

    // 4. Parse FormData
    let formData;
    try {
      formData = await request.formData();
    } catch (parseError) {
      console.error("FormData parsing error:", parseError);
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided in the upload.' }, { status: 400 });
    }

    // Validate file size (50MB limit)
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      }, { status: 400 });
    }

    const filename = file.name;
    const fileExtension = filename.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !isAllowedFileType(fileExtension)) {
      return NextResponse.json({ 
        error: `File type .${fileExtension || 'unknown'} is not allowed.` 
      }, { status: 400 });
    }

    // 5. Upload File to Supabase Storage
    const storagePath = `${institutionId}/${uuidv4()}-${filename}`;
    const bookId = uuidv4();

    let fileBuffer;
    try {
      fileBuffer = Buffer.from(await file.arrayBuffer());
    } catch (bufferError) {
      console.error("File buffer conversion error:", bufferError);
      return NextResponse.json({ error: 'Failed to process file data' }, { status: 500 });
    }

    const { error: uploadError } = await serviceSupabase.storage
      .from('library-files')
      .upload(storagePath, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      });

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError);
      return NextResponse.json({ 
        error: 'Failed to upload file to storage.',
        details: uploadError.message 
      }, { status: 500 });
    }
    
    // 6. Insert Book Metadata
    const { error: insertError } = await serviceSupabase
      .from('books')
      .insert({
        id: bookId,
        institution_id: institutionId,
        title: filename.replace(`.${fileExtension}`, ''), 
        author: 'Unknown',
        file_name: storagePath, 
        is_ingested: false,
        uploaded_by: userId,
      });

    if (insertError) {
      console.error("Book metadata insert error:", insertError);
      // Clean up uploaded file
      await serviceSupabase.storage
        .from('library-files')
        .remove([storagePath]);
      
      return NextResponse.json({ 
        error: 'Failed to record book metadata.',
        details: insertError.message 
      }, { status: 500 });
    }

    // 7. Start Asynchronous Vector Ingestion
    insertVectors({ 
      bookId, 
      institutionId, 
      fileBuffer, 
      fileExtension 
    }).catch(err => {
      console.error(`Background ingestion failed for book ${bookId}:`, err);
    });

    // 8. Success Response
    console.log(`✅ Book uploaded successfully: ${bookId} for institution: ${institutionId}`);
    return NextResponse.json(
      { 
        message: 'Upload successful. Processing vector embeddings in the background.',
        bookId: bookId,
        institutionId: institutionId
      }, 
      { status: 202 }
    );
  } catch (e) {
    console.error('Unhandled error in upload handler:', e);
    return NextResponse.json({ 
      error: 'Internal server error during processing.',
      details: e.message 
    }, { status: 500 });
  }
}
