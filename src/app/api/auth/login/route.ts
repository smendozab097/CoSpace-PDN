import { z } from "zod";
import { AuthService } from "@/services/auth.service";
import { loginSchema } from "@/lib/validations/auth";
import { setAuthCookies } from "@/lib/cookies";
import { HttpError, successResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return HttpError.badRequest(
        "Datos de inicio de sesión inválidos",
        z.flattenError(validation.error).fieldErrors
      );
    }

    const { user, accessToken, refreshToken } = await AuthService.login(
      validation.data
    );

    // Los tokens se envían EXCLUSIVAMENTE en cookies httpOnly, no en el body (Requisito 7)
    const response = successResponse(
      { user },
      200,
      "Inicio de sesión exitoso"
    );

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("Credenciales inválidas")) {
      return HttpError.unauthorized("Credenciales inválidas");
    }
    return HttpError.serverError("Error al iniciar sesión");
  }
}
