import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client that is authenticated with Clerk's session token.
 * This is the new, recommended way to handle client-side authentication.
 * @param {Function} getToken - The `getToken` function from Clerk's `useAuth` hook.
 * @returns A Supabase client instance.
 */
export function createClient(getToken) {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        fetch: async (url, options = {}) => {
          // Get the standard Clerk session token.
          // We no longer need the deprecated 'supabase' template.
          const token = await getToken();

          const headers = new Headers(options.headers);
          headers.set('Authorization', `Bearer ${token}`);
          
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    }
  );
}
