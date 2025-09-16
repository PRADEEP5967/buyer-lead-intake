import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  
  // Public routes that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/error', '/api/auth'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // If the user is not authenticated and the route is not public, redirect to sign-in
  if (!isAuthenticated && !isPublicPath) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If the user is authenticated and trying to access sign-in, redirect to dashboard
  if (isAuthenticated && request.nextUrl.pathname.startsWith('/auth/signin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run the middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
