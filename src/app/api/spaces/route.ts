import { z } from "zod";
import { SpacesService } from "@/services/spaces.service";
import { createSpaceSchema } from "@/lib/validations/spaces";
import { requireAdmin } from "@/lib/auth";
import { HttpError, successResponse } from "@/lib/api-response";

// GET /api/spaces - Listar catálogo público de espacios activos
export async function GET() {
  try {
    const spaces = await SpacesService.listActive();
    return successResponse(spaces);
  } catch (error) {
    return HttpError.serverError((error as Error).message);
  }
}

// POST /api/spaces - Crear nuevo espacio (Solo Administrador)
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return auth.status === 401
      ? HttpError.unauthorized(auth.error)
      : HttpError.forbidden(auth.error);
  }

  try {
    const body = await request.json();
    const validation = createSpaceSchema.safeParse(body);

    if (!validation.success) {
      return HttpError.badRequest(
        "Datos de espacio inválidos",
        z.flattenError(validation.error).fieldErrors
      );
    }

    const space = await SpacesService.create(validation.data);
    return successResponse(space, 201, "Espacio creado exitosamente");
  } catch (error) {
    return HttpError.serverError((error as Error).message);
  }
}
