// src/middleware.ts - Fixed for Edge Runtime
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/api/auth/login", "/api/auth/logout"];

  // Check if the route is public
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Extract token from cookies
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Instead of verifying JWT here, we'll let API routes handle verification
  // This avoids Edge Runtime crypto issues
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect these routes
    "/dashboard/:path*",
    "/upload/:path*",
    "/approval/:path*",
    "/admin/:path*",
    "/api/documents/:path*",
    "/api/workflows/:path*",
    "/api/users/:path*",
  ],
};
