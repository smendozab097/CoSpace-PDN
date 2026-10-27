import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  // Rutas privadas que requieren autenticación
  const isPrivateRoute = pathname.startsWith("/dashboard");
  // Rutas de administración que requieren rol ADMIN
  const isAdminRoute = pathname.startsWith("/admin");

  if (isPrivateRoute || isAdminRoute) {
    if (!accessToken) {
      // Redirigir al login si no tiene sesión activa
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // TODO: Decodificar y verificar el token/rol para rutas de /admin
    // Si no tiene rol ADMIN en /admin, bloquear o redirigir a 403 / home
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/bookings/:path*",
  ],
};
