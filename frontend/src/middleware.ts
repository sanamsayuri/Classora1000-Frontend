import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = new Set(['/', '/login']);

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
    // We fetch user record to check 'approved' and 'is_super_admin' and onboarding
    const { data: userData } = await supabase
      .from('users')
      .select('approved, is_super_admin, organization_name, role')
      .eq('id', user.id)
      .single();

    if (userData) {
      if (!userData.organization_name) {
         if (path !== '/onboarding') {
             return NextResponse.redirect(new URL('/onboarding', request.url));
         }
      } else if (!userData.approved) {
         if (path !== '/pending-approval') {
             return NextResponse.redirect(new URL('/pending-approval', request.url));
         }
      } else {
         // User is approved and onboarded
         if (path === '/onboarding' || path === '/pending-approval') {
             return NextResponse.redirect(new URL('/dashboard', request.url));
         }
         
         if (path.startsWith('/super-admin') && !userData.is_super_admin) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
         }
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
