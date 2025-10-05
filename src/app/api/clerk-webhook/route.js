// src/app/api/clerk-webhook/route.js
import { Webhook } from 'svix';
// REMOVED: We no longer need to import headers from next/headers
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // UPDATED: Get headers directly from the request object
  const headerPayload = req.headers;
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    console.log(`Webhook received: User ${id} has been created`);
    const newApiKey = `sk-${uuidv4()}`;
    
    const { data, error } = await supabase
      .from('institutions')
      .insert([
        { clerk_user_id: id, api_key: newApiKey, name: 'New Institution' },
      ]);

    if (error) {
      console.error('Error inserting new institution:', error);
      return new Response('Error creating institution in DB', { status: 500 });
    }
    console.log(`Successfully created institution for user ${id}`);
  }
  return new Response('', { status: 200 });
}