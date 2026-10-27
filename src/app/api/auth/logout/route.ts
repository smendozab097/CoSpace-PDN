import { AuthService } from "@/services/auth.service";
import { getCurrentUser } from "@/lib/auth";
import { clearAuthCookies } from "@/lib/cookies";
import { successResponse } from "@/lib/api-response";

export async function POST() {
  const currentUser = await getCurrentUser();

  // Si había sesión activa, revocar el refresh token en la base de datos (Requisito 7)
  if (currentUser?.userId) {
    await AuthService.logout(currentUser.userId).catch(() => {
      // Ignorar error si el usuario ya no existía
    });
  }

  const response = successResponse(
    null,
    200,
    "Sesión cerrada exitosamente"
  );

  // Limpiar cookies de la sesión
  clearAuthCookies(response);
  return response;
}
