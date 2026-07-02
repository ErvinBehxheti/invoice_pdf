import { clerkMiddleware } from "@clerk/nextjs/server";

// Auth context only. Every page and API route does its own explicit
// auth()/currentUser() check and returns its own redirect or 401 — see
// app/(app)/layout.tsx and lib/user.ts. auth.protect() is intentionally
// not used here: under Clerk's keyless dev mode it throws when building
// the sign-in redirect for an unauthenticated request (missing
// publishableKey in that code path), which 500s every protected route.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
