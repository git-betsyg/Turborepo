import { auth } from "@/auth";
import { getLocale, locales } from "./lib/locale";
import { NextResponse } from "next/server";

// Specify protected routes
const protectedRoutes = ["/dashboard"];

// 使用 auth 方法作为包装器，此种方式会覆盖 NextAuth 的 authorized 鉴权逻辑
export default auth((req) => {
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

  if (isProtectedRoute && !req.auth) {
    const newUrl = new URL(`/${locale}/signin`, req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
