import { withAuth } from "next-auth/middleware";
import { getLocale, locales } from "./lib/locale";
import { NextResponse } from "next/server";

// Specify protected routes
const protectedRoutes = ["/dashboard"];

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth( // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {

    // Check if there is any supported locale in the pathname
    const { pathname } = req.nextUrl;
    const pathnameHasLocale = locales.some(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );
    const locale = getLocale(req);
    const isProtectedRoute = protectedRoutes.includes(
      pathnameHasLocale ? pathname.replace(`/${locale}`, "") : pathname,
    );

    if (!pathnameHasLocale) {
      // Redirect if there is no locale
      req.nextUrl.pathname = `/${locale}${pathname}`;
      // e.g. incoming request is /products
      // The new URL is now /en-US/products
      return NextResponse.redirect(req.nextUrl);
    }

    if (isProtectedRoute && !req.nextauth.token) {
      const newUrl = new URL(`/`, req.nextUrl.origin);
      return NextResponse.redirect(newUrl);
    }

    return NextResponse.next();
  },
  {
  callbacks: {
    authorized({ req, token }) {
      return true;
    },
  },
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
