// src/lib/data.js

import { createClient } from "@/lib/supabase/server-client"; // Use the new session-aware client
import { auth } from "@clerk/nextjs/server"; // Import Clerk's server auth

export async function getBooks() {
  const supabase = createClient(); // Use the session-aware client for RLS
  const { userId } = auth(); // Get userId from Clerk's server auth
  
  if (!userId) {
    // User is not authenticated, return empty array or throw error
    console.warn("Attempted to fetch books without authentication.");
    return [];
  }

  // First, get the institution ID for the current user
  const { data: institution, error: institutionError } = await supabase
    .from('institutions')
    .select('id')
    .eq('clerk_user_id', userId)
    .single();

  if (institutionError || !institution) {
    console.log(`No institution found for user ${userId}.`);
    return [];
  }

  const { data: books, error: booksError } = await supabase
    .from("books")
    .select("id, title, author, is_ingested, file_name, created_at") // Consistent with existing get-books API and prompt
    .eq("institution_id", institution.id) // Filter by the institution ID
    .order('created_at', { ascending: false }); // Consistent ordering

  if (booksError) {
    console.error("Error fetching books:", booksError);
    throw new Error(`Failed to fetch books: ${booksError.message}`);
  }

  return books || [];
}