import { clerkMiddleware } from "@clerk/nextjs/server";

// Auth context only. Every page and API route does its own explicit
// auth()/currentUser() check and returns its own redirect or 401 — see
// app/(app)/layout.tsx and lib/user.ts. auth.protect() is intentionally
// not used here. Originally dropped because it crashed under Clerk's
// keyless dev mode; re-tested with real dev keys (see DEVELOPMENT_LOG.md)
// and that crash is gone, but auth.protect() still issues an HTML 307
// redirect to /sign-in for API routes even with `Accept: application/json`
// — which would break every client-side fetch() in this app on session
// expiry (JSON.parse on an HTML body). Kept per-route checks for that reason.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
