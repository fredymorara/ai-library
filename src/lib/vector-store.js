// src/lib/vector-store.js

import { createServiceRoleClient } from "@/lib/supabase/server-client";

// Define the table where vector data is stored
const VECTOR_TABLE = 'book_vectors'; 

/**
 * Writes text chunks and their embeddings to the pgvector table.
 * @param {string} bookId - The ID of the book being processed.
 * @param {string} institutionId - The institution ID for multi-tenancy.
 * @param {Array<string>} chunks - The text segments.
 * @param {Array<Array<number>>} embeddings - The vector representations of the chunks.
 */
export async function insertVectors(bookId, institutionId, chunks, embeddings) {
    if (chunks.length !== embeddings.length) {
        throw new Error("Chunk and embedding arrays must have the same length.");
    }
    
    // Use the Service Role Client for this high-privilege bulk write operation
    const supabase = createServiceRoleClient(); 

    const records = chunks.map((chunk, index) => ({
        book_id: bookId,
        institution_id: institutionId, // For RLS and multi-tenancy
        content: chunk,
        embedding: embeddings[index],
        // You might add metadata like chunk_index here
    }));

    // Perform the bulk insert
    const { error } = await supabase
        .from(VECTOR_TABLE)
        .insert(records);

    if (error) {
        console.error("Error inserting vectors into Supabase:", error);
        throw new Error(`Vector insert failed: ${error.message}`);
    }
}
