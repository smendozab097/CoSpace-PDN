import { BookingsService } from "@/services/bookings.service";
import { requireUser } from "@/lib/auth";
import { HttpError, successResponse } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PATCH /api/bookings/[id]/cancel - Cancelar reserva
// Reglas 9, 10, 11 y 14
export async function PATCH(_request: Request, { params }: RouteParams) {
  const auth = await requireUser();
  if ("error" in auth) {
    return HttpError.unauthorized(auth.error);
  }

  try {
    const { id } = await params;
    const cancelledBooking = await BookingsService.cancelBooking(
      id,
      auth.user.userId,
      auth.user.role
    );

    return successResponse(
      cancelledBooking,
      200,
      "Reserva cancelada exitosamente"
    );
  } catch (error) {
    const message = (error as Error).message;

    if (message.includes("No tienes autorización")) {
      return HttpError.forbidden(message);
    }

    if (message.includes("no encontrada")) {
      return HttpError.notFound(message);
    }

    if (message.includes("2 horas antes") || message.includes("ya se encuentra cancelada")) {
      return HttpError.conflict(message);
    }

    return HttpError.serverError(message);
  }
}
