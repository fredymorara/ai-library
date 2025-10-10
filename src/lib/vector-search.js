// src/lib/vector-search.js

import { createClient } from "@/lib/supabase/server-client"; // Session-aware client
import { getEmbedding } from './pdf-processor'; // Reuse the embedding function (placeholder)

/**
 * Performs a vector similarity search in the Supabase pgvector table.
 * @param {string} queryText - The user's query text.
 * @param {string} institutionId - The institution ID for filtering.
 * @param {number} k - The number of top documents to retrieve.
 * @returns {Promise<Array<{content: string, book_id: string}>>} Retrieved context chunks.
 */
export async function retrieveContext(queryText, institutionId, k = 5) {
  // 1. Generate Query Embedding
  // NOTE: This MUST use the same model used for ingestion (gemini-2.5-flash-preview-05-20 in our plan)
  const queryEmbedding = await getEmbedding(queryText);
  
  // 2. Initialize Supabase Client
  // Using the RLS-respecting client. The institution filter below acts as a multi-tenancy safeguard.
  const supabase = createClient(); 
  
  // 3. Perform Vector Search and Filter
  // This query uses the <-> operator for cosine similarity search (pgvector requirement).
  const { data, error } = await supabase.rpc('match_vectors', {
    query_embedding: queryEmbedding,
    match_institution_id: institutionId, // Filters by institution ID
    match_count: k, // Limits the number of results
  });

  if (error) {
    console.error('Vector search failed:', error);
    throw new Error('Failed to retrieve relevant context from the library.');
  }

  // NOTE: You must have a stored function named 'match_vectors' in your Supabase DB:
  /* CREATE OR REPLACE FUNCTION match_vectors(
    query_embedding vector(1536), -- Must match embedding dimension
    match_institution_id uuid,
    match_count int
  )
  RETURNS TABLE (
    book_id uuid,
    content text,
    similarity float
  )
  LANGUAGE sql STABLE AS $$
    SELECT
      vectors.book_id,
      vectors.content,
      1 - (vectors.embedding <=> query_embedding) AS similarity
    FROM vectors
    WHERE vectors.institution_id = match_institution_id
    ORDER BY vectors.embedding <=> query_embedding
    LIMIT match_count;
  $$;
  */

  // Extract content and book ID for prompt assembly
  return data.map(item => ({
      content: item.content, 
      book_id: item.book_id
  }));
}
