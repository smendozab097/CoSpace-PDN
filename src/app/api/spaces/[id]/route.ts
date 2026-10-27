import { z } from "zod";
import { SpacesService } from "@/services/spaces.service";
import { updateSpaceSchema } from "@/lib/validations/spaces";
import { requireAdmin } from "@/lib/auth";
import { HttpError, successResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/spaces/[id] - Detalle del espacio
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const space = await SpacesService.getById(id);

    if (!space) {
      return HttpError.notFound("Espacio no encontrado");
    }

    return successResponse(space);
  } catch (error) {
    return HttpError.serverError((error as Error).message);
  }
}

// PUT /api/spaces/[id] - Editar espacio (Solo Administrador)
export async function PUT(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return auth.status === 401
      ? HttpError.unauthorized(auth.error)
      : HttpError.forbidden(auth.error);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validation = updateSpaceSchema.safeParse(body);

    if (!validation.success) {
      return HttpError.badRequest(
        "Datos de actualización inválidos",
        z.flattenError(validation.error).fieldErrors
      );
    }

    const updated = await SpacesService.update(id, validation.data);
    return successResponse(updated, 200, "Espacio actualizado exitosamente");
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("no encontrado")) {
      return HttpError.notFound(message);
    }
    return HttpError.serverError(message);
  }
}
