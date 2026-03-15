import { NextResponse, NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ALLOW API REQUESTS TO PASS THROUGH
  // This prevents the middleware from redirecting your registration API
  // to an HTML login page (which causes the "Unexpected token <" error)
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. CHECK FOR AUTHENTICATION
  // Replace 'auth_token' with whatever cookie name you use for login
  const token = request.cookies.get('auth_token')?.value;

  // 3. PROTECT SENSITIVE ROUTES
  // If the user is NOT logged in and tries to access the dashboard
  if (!token && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. PREVENT LOGGED-IN USERS FROM SEEING LOGIN/REGISTER
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// CONFIG: Define which paths this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};