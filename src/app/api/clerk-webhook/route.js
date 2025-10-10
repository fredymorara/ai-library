// src/app/api/clerk-webhook/route.js
import { Webhook } from 'svix';
import { createServiceRoleClient } from "@/lib/supabase/server-client"; // <-- NEW: Import Service Role Client
import { v4 as uuidv4 } from 'uuid';

// The webhook secret is a private environment variable
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
export async function POST(req) {
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
    console.error('Error verifying webhook:', err.message);
    return new Response('Error verifying webhook', { status: 400 });
  }

  const eventType = evt.type;

  // CRITICAL CHANGE: Use the Service Role Client to bypass RLS for admin writes
  const supabase = createServiceRoleClient();

  if (eventType === 'user.created') {
    const { id } = evt.data;
    console.log(`Webhook received: User ${id} has been created`);

    // Generate a secure, unique API key for the new institution
    const newApiKey = `sk-${uuidv4()}`;
    
    const { data, error } = await supabase
      .from('institutions')
      .insert([
        { clerk_user_id: id, api_key: newApiKey, name: 'New Institution' }, // Assuming user-as-institution model
      ]);

    if (error) {
      console.error('Error inserting new institution:', error);
      return new Response('Supabase write error', { status: 500 });
    }
    console.log(`Successfully created institution for user ${id}`);
  }

  // You can add handlers for other events like 'user.updated', 'user.deleted', etc.

  return new Response('OK', { status: 200 });
}