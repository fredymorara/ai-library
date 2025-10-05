// src/middleware.js
 import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

 // Define routes that should be publicly accessible
 const isPublicRoute = createRouteMatcher([
   '/', // The landing page
   '/api/clerk-webhook', // The webhook endpoint
 ]);

 export default clerkMiddleware((auth, req) => {
   // Protect all routes except the public ones
   if (!isPublicRoute(req)) {
     auth().protect();
   }
 });

 export const config = {
   matcher: [
     // Skip Next.js internals and all static files, unless found in search params
     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
     // Always run for API routes
     "/(api|trpc)(.*)",
   ],
 };