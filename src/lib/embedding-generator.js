// src/lib/embedding-generator.js

// Available embedding models
const MODELS = {
  MINI_LM: {
    url: "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    dimensions: 384,
    name: "MiniLM"
  },
  BGE_SMALL: {
    url: "https://api-inference.huggingface.co/models/BAAI/bge-small-en-v1.5",
    dimensions: 384,
    name: "BGE-Small"
  },
  BGE_BASE: {
    url: "https://api-inference.huggingface.co/models/BAAI/bge-base-en-v1.5",
    dimensions: 768,
    name: "BGE-Base"
  }
};

// Select which model to use (change this to switch models)
const ACTIVE_MODEL = process.env.EMBEDDING_MODEL 
  ? MODELS[process.env.EMBEDDING_MODEL] 
  : MODELS.BGE_SMALL;

/**
 * Generates an embedding for a given text chunk using the Hugging Face Inference API.
 * @param {string} text - The text chunk to embed.
 * @param {number} maxRetries - Maximum number of retry attempts.
 * @returns {Promise<Array<number>>} The vector embedding.
 */
export async function getEmbedding(text, maxRetries = 3) {
  // Validate environment
  if (!process.env.HF_TOKEN) {
    throw new Error("HF_TOKEN environment variable is not set");
  }

  // Validate input
  if (!text || typeof text !== 'string') {
    throw new Error("Invalid text input for embedding");
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(ACTIVE_MODEL.url, {
        method: "POST",
        headers: { 
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          inputs: text.trim(), 
          options: { wait_for_model: true } 
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorBody;
        
        try {
          if (contentType?.includes('application/json')) {
            errorBody = await response.json();
          } else {
            errorBody = await response.text();
          }
        } catch (parseError) {
          errorBody = 'Failed to parse error response';
        }

        // Handle specific error codes
        if (response.status === 503) {
          // Model is loading
          const waitTime = Math.min(2000 * Math.pow(2, attempt), 10000);
          console.log(`[${ACTIVE_MODEL.name}] Model loading, waiting ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})`);
          await sleep(waitTime);
          continue;
        }

        if (response.status === 429) {
          // Rate limited
          const waitTime = Math.min(3000 * Math.pow(2, attempt), 20000);
          console.log(`[${ACTIVE_MODEL.name}] Rate limited, waiting ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})`);
          await sleep(waitTime);
          continue;
        }

        if (response.status === 401) {
          throw new Error("Invalid HF_TOKEN. Check your Hugging Face API token.");
        }

        throw new Error(`HF API error (${response.status}): ${JSON.stringify(errorBody)}`);
      }

      const result = await response.json();
      
      // Validate response
      if (!result) {
        throw new Error("Empty response from Hugging Face API");
      }

      // Handle different response formats
      let embedding;
      if (Array.isArray(result)) {
        embedding = Array.isArray(result[0]) ? result[0] : result;
      } else if (result.embeddings) {
        embedding = result.embeddings[0] || result.embeddings;
      } else {
        embedding = result;
      }

      // Validate embedding
      if (!Array.isArray(embedding) || embedding.length === 0) {
        throw new Error("Invalid embedding format received");
      }

      return embedding;

    } catch (error) {
      console.error(`[${ACTIVE_MODEL.name}] Embedding error (attempt ${attempt + 1}/${maxRetries}):`, error.message);
      
      // Don't retry on authentication errors
      if (error.message.includes('Invalid HF_TOKEN')) {
        throw error;
      }
      
      // Last attempt - throw error
      if (attempt === maxRetries - 1) {
        throw new Error(`Failed to generate embedding after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry
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

  console.log(`[${ACTIVE_MODEL.name}] Starting batch processing: ${textChunks.length} chunks in ${totalBatches} batches`);

  for (let i = 0; i < textChunks.length; i += batchSize) {
    const batch = textChunks.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;

    console.log(`[${ACTIVE_MODEL.name}] Processing batch ${batchNum}/${totalBatches} (${batch.length} chunks)`);

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

      // Delay between batches to avoid rate limiting
      if (i + batchSize < textChunks.length) {
        await sleep(delayMs);
      }
    } catch (error) {
      console.error(`[${ACTIVE_MODEL.name}] Batch ${batchNum} failed:`, error.message);
      throw new Error(`Batch processing failed at batch ${batchNum}: ${error.message}`);
    }
  }

  console.log(`[${ACTIVE_MODEL.name}] Batch processing complete: ${embeddings.length} embeddings generated`);
  return embeddings;
}

/**
 * Get the dimension size for the active model
 * @returns {number} Embedding dimension
 */
export function getEmbeddingDimension() {
  return ACTIVE_MODEL.dimensions;
}

/**
 * Get information about the active model
 * @returns {Object} Model information
 */
export function getModelInfo() {
  return {
    name: ACTIVE_MODEL.name,
    url: ACTIVE_MODEL.url,
    dimensions: ACTIVE_MODEL.dimensions
  };
}

/**
 * Helper function to sleep/delay
 * @param {number} ms - Milliseconds to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}