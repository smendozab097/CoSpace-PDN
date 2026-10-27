import { cookies } from "next/headers";
import { AuthService } from "@/services/auth.service";
import { setAuthCookies, clearAuthCookies, REFRESH_TOKEN_COOKIE } from "@/lib/cookies";
import { HttpError, successResponse } from "@/lib/api-response";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    if (!refreshToken) {
      return HttpError.unauthorized("No se encontró el refresh token");
    }

    const { accessToken, user } = await AuthService.refreshAccessToken(refreshToken);

    const response = successResponse(
      { user },
      200,
      "Access token renovado exitosamente"
    );

    // Se actualiza el access token en cookies (Requisito 7)
    setAuthCookies(response, accessToken);
    return response;
  } catch (error) {
    const response = HttpError.unauthorized(
      (error as Error).message || "Sesión expirada"
    );
    clearAuthCookies(response);
    return response;
  }
}
