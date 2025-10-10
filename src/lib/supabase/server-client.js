import { createServerClient } from '@supabase/ssr';
import { createClient as createBaseClient } from '@supabase/supabase-js'; // <-- NEW IMPORT
import { cookies } from 'next/headers';

/**
 * Creates a Supabase client instance that is authenticated with the user's session
 * via cookies, allowing it to correctly enforce Row-Level Security (RLS).
 * ...
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // Read-only Server Component, ignore error
          }
        },
        remove(name, options) {
          try {
            cookieStore.set(name, '', options);
          } catch (error) {
            // Read-only Server Component, ignore error
          }
        },
      },
    }
  );
}

/**
 * Creates a Supabase client instance using the *Service Role Key*.
 * This key bypasses all RLS and is only for administrative tasks (like webhooks).
 * * CRITICAL FIX: Use createBaseClient (not createServerClient) as it doesn't need cookies.
 * @returns SupabaseClient
 */
export function createServiceRoleClient() {
  return createBaseClient( // <-- FIXED: Using basic client
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // This is the secret key
    {
      auth: {
        persistSession: false, 
      },
    }
  );
}
