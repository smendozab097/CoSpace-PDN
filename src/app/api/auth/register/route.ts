import { z } from "zod";
import { AuthService } from "@/services/auth.service";
import { registerSchema } from "@/lib/validations/auth";
import { setAuthCookies } from "@/lib/cookies";
import { HttpError, successResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return HttpError.badRequest(
        "Datos de registro inválidos",
        z.flattenError(validation.error).fieldErrors
      );
    }

    const { user, accessToken, refreshToken } = await AuthService.register(
      validation.data
    );

    // Los tokens se envían EXCLUSIVAMENTE en cookies httpOnly, no en el body (Requisito 7)
    const response = successResponse(
      { user },
      201,
      "Usuario registrado exitosamente"
    );

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("ya está registrado")) {
      return HttpError.conflict(message);
    }
    return HttpError.serverError("Error al registrar el usuario");
  }
}
