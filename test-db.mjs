import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.trim().match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1]] = match[2];
  }
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDb() {
  // Try to get a single vector to see its length
  const { data, error } = await supabase.from('book_vectors').select('embedding').limit(1);
  if (error) {
    console.error("Error fetching vector:", error);
    return;
  }
  if (data && data.length > 0) {
    let emb = data[0].embedding;
    if (typeof emb === 'string') {
        emb = JSON.parse(emb);
    }
    console.log("Existing vector dimension:", emb.length);
  } else {
    console.log("No existing vectors found.");
  }
}

checkDb();
