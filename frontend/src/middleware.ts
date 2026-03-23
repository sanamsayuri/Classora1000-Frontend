import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Firebase-only auth is handled client-side via `AuthProvider` (Firebase Auth + Firestore).
  // Keep middleware minimal to avoid blocking routes with legacy JWT cookies.
  const path = request.nextUrl.pathname;
  if (path === '/register') return NextResponse.redirect(new URL('/login', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
