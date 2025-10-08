// src/app/api/upload-books/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    let { data: institution } = await supabaseAdmin.from('institutions').select('id').eq('clerk_user_id', userId).single();
    if (!institution) {
      const newApiKey = `sk-${uuidv4()}`;
      const { data: newInstitution, error: createError } = await supabaseAdmin.from('institutions').insert({ clerk_user_id: userId, api_key: newApiKey, name: 'New Institution' }).select('id').single();
      if (createError) throw createError;
      institution = newInstitution;
    }
    
    const institutionId = institution.id;
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) return new NextResponse(JSON.stringify({ error: "No file uploaded." }), { status: 400 });

    // --- NEW CSV PARSING LOGIC ---
    const fileText = await file.text();
    const parsedCsv = Papa.parse(fileText, {
      header: true,
      skipEmptyLines: true,
    });

    // Map the parsed data into the format for our 'books' table
    const booksToInsert = parsedCsv.data.map(row => ({
      institution_id: institutionId,
      title: row.title,
      author: row.authors || row.author, // Accept 'authors' or 'author' column
      // Add other columns here if you have them, e.g., summary: row.summary
    })).filter(book => book.title); // Filter out any rows that don't have a title

    if (booksToInsert.length === 0) {
      return new NextResponse(JSON.stringify({ error: "No valid books found in the CSV. Please ensure you have 'title' and 'authors' columns." }), { status: 400 });
    }

    // Perform a bulk insert into the 'books' table
    const { error: insertError } = await supabaseAdmin
      .from('books')
      .insert(booksToInsert);

    if (insertError) {
      throw new Error(`Failed to save books to database: ${insertError.message}`);
    }

    console.log(`Successfully inserted ${booksToInsert.length} books for institution ${institutionId}`);

    return NextResponse.json({ 
      status: "success", 
      message: `${booksToInsert.length} books have been successfully added to your collection. You can now manage them below.`
    });

  } catch (error) {
    console.error('Error in upload-books API:', error);
    return new NextResponse(JSON.stringify({ error: error.message || "An internal server error occurred." }), { status: 500 });
  }
}