import fs from 'fs';
import { getEmbedding } from './src/lib/embedding-generator.js';

// Parse .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.trim().match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1]] = match[2];
  }
});

async function test() {
  try {
    const text = "This is a test document to embed.";
    console.log("Generating embedding...");
    console.log("HF Token present:", !!process.env.HF_TOKEN);
    const embedding = await getEmbedding(text);
    console.log("Embedding generated successfully!");
    console.log("Dimension:", embedding.length);
  } catch (err) {
    console.error("Failed:", err);
  }
}

test();
