// src/lib/embedding-generator.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const DIMENSIONS = 384; // Matches the existing Supabase book_vectors table
const MODEL_NAME = "gemini-embedding-2";

/**
 * Generates an embedding for a given text chunk using Google Gemini API.
 * @param {string} text - The text chunk to embed.
 * @param {number} maxRetries - Maximum number of retry attempts.
 * @returns {Promise<Array<number>>} The vector embedding.
 */
export async function getEmbedding(text, maxRetries = 3) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  if (!text || typeof text !== 'string') {
    throw new Error("Invalid text input for embedding");
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await model.embedContent({
        content: { parts: [{ text: text.trim() }] },
        outputDimensionality: DIMENSIONS,
      });
      const embedding = result.embedding.values;

      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error("Invalid embedding format received");
      }

      return embedding;

    } catch (error) {
      console.error(`[${MODEL_NAME}] Embedding error (attempt ${attempt + 1}/${maxRetries}):`, error.message);
      
      if (attempt === maxRetries - 1) {
        throw new Error(`Failed to generate embedding after ${maxRetries} attempts: ${error.message}`);
      }
      
      await sleep(1000 * (attempt + 1));
    }
  }
}

/**
 * Batch process embeddings with progress tracking
 * @param {Array<string>} textChunks - Array of text chunks
 * @param {Object} options - Options for batch processing
 * @returns {Promise<Array<Array<number>>>} Array of embeddings
 */
export async function getEmbeddingsBatch(textChunks, options = {}) {
  const {
    batchSize = 5,
    delayMs = 1000,
    onProgress = null
  } = options;

  if (!Array.isArray(textChunks) || textChunks.length === 0) {
    throw new Error("Invalid textChunks array");
  }

  const embeddings = [];
  const totalBatches = Math.ceil(textChunks.length / batchSize);

  console.log(`[${MODEL_NAME}] Starting batch processing: ${textChunks.length} chunks in ${totalBatches} batches`);

  for (let i = 0; i < textChunks.length; i += batchSize) {
    const batch = textChunks.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;

    console.log(`[${MODEL_NAME}] Processing batch ${batchNum}/${totalBatches} (${batch.length} chunks)`);

    try {
      const batchEmbeddings = await Promise.all(
        batch.map(chunk => getEmbedding(chunk))
      );

      embeddings.push(...batchEmbeddings);

      if (onProgress) {
        onProgress({
          current: embeddings.length,
          total: textChunks.length,
          batch: batchNum,
          totalBatches,
          percentage: Math.round((embeddings.length / textChunks.length) * 100)
        });
      }

      if (i + batchSize < textChunks.length) {
        await sleep(delayMs);
      }
    } catch (error) {
      console.error(`[${MODEL_NAME}] Batch ${batchNum} failed:`, error.message);
      throw new Error(`Batch processing failed at batch ${batchNum}: ${error.message}`);
    }
  }

  return embeddings;
}

/**
 * Get the dimension size for the active model
 * @returns {number} Embedding dimension
 */
export function getEmbeddingDimension() {
  return DIMENSIONS;
}

/**
 * Get information about the active model
 * @returns {Object} Model information
 */
export function getModelInfo() {
  return {
    name: MODEL_NAME,
    url: "https://ai.google.dev/models/gemini",
    dimensions: DIMENSIONS
  };
}

/**
 * Helper function to sleep/delay
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}