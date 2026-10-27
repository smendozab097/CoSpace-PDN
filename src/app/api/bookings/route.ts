import { BookingsService } from "@/services/bookings.service";
import { requireUser } from "@/lib/auth";
import { HttpError, successResponse } from "@/lib/api-response";

// GET /api/bookings - Listar reservas del usuario autenticado (Regla 14)
export async function GET() {
  const auth = await requireUser();
  if ("error" in auth) {
    return HttpError.unauthorized(auth.error);
  }

  try {
    const bookings = await BookingsService.listUserBookings(auth.user.userId);
    return successResponse(bookings);
  } catch (error) {
    return HttpError.serverError((error as Error).message);
  }
}

// POST /api/bookings - Crear reserva aplicando las reglas de negocio
export async function POST(request: Request) {
  const auth = await requireUser();
  if ("error" in auth) {
    return HttpError.unauthorized(auth.error);
  }

  try {
    const body = await request.json();

    if (!body.spaceId || !body.startTime || !body.endTime) {
      return HttpError.badRequest(
        "Se requieren spaceId, startTime y endTime para crear la reserva"
      );
    }

    const booking = await BookingsService.createBooking({
      userId: auth.user.userId,
      spaceId: body.spaceId,
      startTime: body.startTime,
      endTime: body.endTime,
    });

    return successResponse(booking, 201, "Reserva creada exitosamente");
  } catch (error) {
    const message = (error as Error).message;

    if (
      message.includes("solapa") ||
      message.includes("límite máximo") ||
      message.includes("desactivado")
    ) {
      return HttpError.conflict(message);
    }

    if (
      message.includes("pasado") ||
      message.includes("horas completas") ||
      message.includes("30 días") ||
      message.includes("entre 1 y 4 horas") ||
      message.includes("07:00 y las 21:00")
    ) {
      return HttpError.badRequest(message);
    }

    if (message.includes("no existe")) {
      return HttpError.notFound(message);
    }

    return HttpError.serverError(message);
  }
}
