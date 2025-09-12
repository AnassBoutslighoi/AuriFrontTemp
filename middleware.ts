import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only these are public. Everything else must be authenticated.
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/favicon.ico",
  "/widget(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return;

  // Explicit sign-in URL to avoid accidental redirects to "/"
  const signInPath = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";
  const signInUrl = new URL(signInPath, req.url).toString();

  // Protect all non-public routes (including "/")
  await auth.protect({
    unauthenticatedUrl: signInUrl,
  });
});

// Use Clerk's recommended matcher to ensure "/" and APIs are covered
export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // all paths excluding _next and static files
    "/",
    "/(api|trpc)(.*)",
  ],
};