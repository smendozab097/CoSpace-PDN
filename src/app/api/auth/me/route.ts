import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, setAuthCookies } from "@/lib/cookies";
import { AuthService } from "@/services/auth.service";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (accessToken) {
      const payload = await verifyAccessToken(accessToken);
      if (payload) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { id: true, name: true, email: true, role: true },
        });

        if (user) {
          return NextResponse.json({ success: true, user });
        }
      }
    }

    // Si access token expiró o no existe, intentar renovación transparente con refresh token
    if (refreshToken) {
      try {
        const { accessToken: newAccessToken, user } =
          await AuthService.refreshAccessToken(refreshToken);
        const response = NextResponse.json({ success: true, user });
        setAuthCookies(response, newAccessToken);
        return response;
      } catch {
        // Refresh token revocado o expirado
      }
    }

    return NextResponse.json({ success: false, user: null });
  } catch {
    return NextResponse.json({ success: false, user: null });
  }
}
