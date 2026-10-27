import { SpacesService } from "@/services/spaces.service";
import { requireAdmin } from "@/lib/auth";
import { HttpError, successResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PATCH /api/spaces/[id]/status - Alternar estado o activar/desactivar espacio (Solo Administrador)
// Regla 12: Un espacio no se elimina, se desactiva.
// Regla 13: No se puede desactivar un espacio que tenga reservas futuras confirmadas.
export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return auth.status === 401
      ? HttpError.unauthorized(auth.error)
      : HttpError.forbidden(auth.error);
  }

  try {
    const { id } = await params;
    let targetActive: boolean | undefined = undefined;

    try {
      const text = await request.text();
      if (text) {
        const body = JSON.parse(text);
        if (typeof body.isActive === "boolean") {
          targetActive = body.isActive;
        }
      }
    } catch {
      // Body vacío o no parseable: se alternará el estado actual
    }

    const updatedSpace = await SpacesService.setStatus(id, targetActive);

    const message = updatedSpace.isActive
      ? "Espacio activado exitosamente"
      : "Espacio desactivado exitosamente";

    return successResponse(updatedSpace, 200, message);
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("no encontrado")) {
      return HttpError.notFound(message);
    }
    if (message.includes("reservas futuras")) {
      return HttpError.conflict(message);
    }
    return HttpError.serverError(message);
  }
}
