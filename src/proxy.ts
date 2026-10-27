import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/jwt";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/cookies";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  const isPrivateRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  // Si el usuario ya tiene sesión activa (por access token o refresh token),
  // se le bloquea el acceso a /login y /register y se le redirige a su panel
  if (isAuthRoute) {
    if (token) {
      const payload = await verifyAccessToken(token);
      if (payload) {
        const redirectUrl = new URL(
          payload.role === "ADMIN" ? "/admin" : "/dashboard",
          request.url
        );
        return NextResponse.redirect(redirectUrl);
      }
    }

    if (refreshToken) {
      const refreshPayload = await verifyRefreshToken(refreshToken);
      if (refreshPayload) {
        const redirectUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // Protección de rutas privadas y administrativas
  if (isPrivateRoute || isAdminRoute) {
    if (!token && !refreshToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token) {
      const payload = await verifyAccessToken(token);

      if (!payload && !refreshToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(ACCESS_TOKEN_COOKIE);
        return response;
      }

      // Proteger rutas de admin para que solo ADMIN tenga acceso
      if (payload && isAdminRoute && payload.role !== "ADMIN") {
        const forbiddenUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(forbiddenUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login/:path*",
    "/register/:path*",
    "/login",
    "/register",
  ],
};
