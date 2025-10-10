import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// Public routes - no authentication required
const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/features', 
  '/pricing',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/clerk-webhook',
  '/api/chat(.*)', // Public chat API with API key auth
  '/api/search(.*)', // Public search API with API key auth
]);

// Admin routes - require Clerk authentication + organization
const requiresOrganization = createRouteMatcher([
  '/admin(.*)',
  '/dashboard(.*)',
  '/api/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes (including public API routes)
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  const {userId, orgId, redirectToSignIn} = await auth();

  // Redirect unauthenticated users to sign in
  if (!userId) {
    return redirectToSignIn();
  }

  // Check if route requires organization (admin routes)
  if (requiresOrganization(req)) {
    if (!orgId) {
      // Redirect to organization setup page
      const orgSetupUrl = new URL('/organization-setup', req.url);
      return NextResponse.redirect(orgSetupUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
};