import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from 'next/server';

// Define routes that need protection
const isProtectedRoute = createRouteMatcher(["/server"]);

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in',
  '/sign-up',
  '/',
  // Crucially, we need to make the uploadthing API endpoint public
  '/api/uploadthing',
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, redirectToSignIn } = await auth();

  // Allow all public routes without redirection
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // If the user isn't signed in and the route is not public, redirect to sign-in
  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  // Only apply additional protection to specifically protected routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
