import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = new Set(['/', '/login', '/register']);

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Static files or other excluded paths handled by matcher.

  if (!user && !PUBLIC_ROUTES.has(path)) {
    // No user, trying to access private route
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && path === '/login') {
    // User is logged in, redirect away from login
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Next steps: Ensure user is approved and onboarded
  if (user) {
    try {
      // Fetch user record from our Prisma backend via internal API
      const res = await fetch(new URL('/api/user/me', request.url), {
        headers: {
          cookie: request.headers.get('cookie') || '', // pass cookies for auth
        }
      });

      if (res.ok) {
        const { user: prismaUser } = await res.json();
        
        if (!prismaUser.role) {
           if (path !== '/onboarding') {
               return NextResponse.redirect(new URL('/onboarding', request.url));
           }
        } else if (!prismaUser.approved) {
           if (path !== '/pending-approval') {
               return NextResponse.redirect(new URL('/pending-approval', request.url));
           }
        } else {
           // User is approved and onboarded
           if (path === '/onboarding' || path === '/pending-approval') {
               return NextResponse.redirect(new URL('/dashboard', request.url));
           }
           
           if (path.startsWith('/super-admin') && !prismaUser.isSuperAdmin) {
              return NextResponse.redirect(new URL('/dashboard', request.url));
           }
        }
      } else {
        // User not in Prisma DB yet, redirect to onboarding or let callback handle it
        if (path !== '/onboarding' && path !== '/login' && path !== '/register') {
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
      }
    } catch (e) {
      console.error('Middleware fetch error:', e);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
