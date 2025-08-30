import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Define protected routes
        const protectedRoutes = ['/dashboard', '/accounts', '/mappings'];
        const authRoutes = ['/auth/login', '/auth/register'];
        
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        );
        const isAuthRoute = authRoutes.some(route => 
          pathname.startsWith(route)
        );

        // If accessing auth routes and already authenticated, redirect to dashboard
        if (isAuthRoute && token) {
          return false; // This will redirect to the default redirect URL (dashboard)
        }

        // If accessing protected route, require authentication
        if (isProtectedRoute) {
          return !!token;
        }

        // Allow access to public routes
        return true;
      },
    },
    pages: {
      signIn: '/auth/login',
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
