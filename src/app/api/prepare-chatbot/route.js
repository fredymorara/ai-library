// src/app/api/prepare-chatbot/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';

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

    // 1. Get the user's institution ID
    const { data: institution, error: institutionError } = await supabaseAdmin
      .from('institutions')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (institutionError || !institution) {
      return new NextResponse(JSON.stringify({ error: "Institution not found." }), { status: 404 });
    }

    // 2. Fetch all books for the institution
    const { data: books, error: booksError } = await supabaseAdmin
      .from('books')
      .select('title, author')
      .eq('institution_id', institution.id);

    if (booksError) {
      throw booksError;
    }

    // 3. Convert the book data to a CSV string
    const csv = Papa.unparse(books);

    // 4. Upload the CSV to Supabase Storage
    const filePath = `for-ingestion/${institution.id}_books.csv`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('book-collections')
      .upload(filePath, csv, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    // 5. Make a POST request to the FastAPI service
    const fastapiUrl = process.env.FASTAPI_URL;
    if (!fastapiUrl) {
      throw new Error("FASTAPI_URL environment variable not set.");
    }

    const response = await fetch(`${fastapiUrl}/start-ingestion-job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_path: filePath }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to start ingestion job.");
    }

    return NextResponse.json({ message: 'Chatbot preparation has begun. This may take several minutes.' });

  } catch (error) {
    console.error('Error preparing chatbot:', error);
    return new NextResponse(JSON.stringify({ error: error.message || "An internal server error occurred." }), { status: 500 });
  }
}
