import { NextRequest, NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard"];

// Public routes that should redirect to dashboard if user is logged in
const publicRoutes = ["/"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get user from localStorage (stored during login)
  // In a real app, you'd validate with a JWT token or session
  const user = request.cookies.get("user")?.value;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route);

  // If accessing protected route without auth, redirect to login
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If accessing login page while authenticated, redirect to dashboard
  if (isPublicRoute && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
