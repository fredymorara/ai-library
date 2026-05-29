import { createClient as createBaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client instance authenticated with a Clerk JWT token.
 * This ensures all queries operate strictly within the bounds of Row Level Security (RLS).
 * @param {string} clerkToken - The JWT token retrieved from Clerk
 * @returns SupabaseClient
 */
export function createClient(clerkToken) {
  return createBaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${clerkToken}`,
        },
      },
    }
  );
}

/**
 * Creates a Supabase client instance using the *Service Role Key*.
 * This key bypasses all RLS and is only for administrative tasks (like webhooks).
 * @returns SupabaseClient
 */
export function createServiceRoleClient() {
  return createBaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
