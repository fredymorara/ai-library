import dotenv from 'dotenv';
import { getEmbedding } from './src/lib/embedding-generator.js';

dotenv.config({ path: '.env.local' });

async function test() {
  try {
    const text = "This is a test document to embed.";
    console.log("Generating embedding...");
    const embedding = await getEmbedding(text);
    console.log("Embedding generated successfully!");
    console.log("Dimension:", embedding.length);
  } catch (err) {
    console.error("Failed:", err);
  }
}

test();
