import { prisma } from "@/lib/prisma";
import type { BookingStatus } from "@/types";

export interface CreateBookingInput {
  userId: string;
  spaceId: string;
  startTime: Date | string;
  endTime: Date | string;
}

export class BookingsService {
  /**
   * Valida restricciones de tiempo y horario (Reglas 1, 2 y 3)
   */
  static validateTiming(start: Date, end: Date): { durationHours: number } {
    const now = new Date();

    // Regla 3: No en el pasado
    if (start <= now) {
      throw new Error("No se puede realizar una reserva en el pasado");
    }

    // Regla 3: No más de 30 días de anticipación
    const maxFuture = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (start > maxFuture) {
      throw new Error("No se puede reservar con más de 30 días de anticipación");
    }

    // Regla 1: Horas completas (sin minutos ni segundos fraccionados)
    if (
      start.getMinutes() !== 0 ||
      start.getSeconds() !== 0 ||
      end.getMinutes() !== 0 ||
      end.getSeconds() !== 0
    ) {
      throw new Error(
        "Las reservas deben ser en horas completas (ejemplo: de 10:00 a 12:00)"
      );
    }

    // Regla 1: Duración entre 1 y 4 horas
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (durationHours < 1 || durationHours > 4) {
      throw new Error("La duración de la reserva debe ser entre 1 y 4 horas");
    }

    // Regla 2: Solo entre las 7:00 y las 21:00
    const startHour = start.getHours();
    const endHour = end.getHours();

    if (startHour < 7 || endHour > 21 || (endHour === 21 && end.getMinutes() > 0)) {
      throw new Error(
        "El horario permitido para reservas es entre las 07:00 y las 21:00"
      );
    }

    return { durationHours };
  }

  /**
   * Crea una nueva reserva aplicando las 8 reglas de negocio
   */
  static async createBooking(input: CreateBookingInput) {
    const start = new Date(input.startTime);
    const end = new Date(input.endTime);

    // Validar tiempo, duración y horario
    const { durationHours } = this.validateTiming(start, end);

    // Regla 7: No se puede reservar un espacio desactivado
    const space = await prisma.space.findUnique({
      where: { id: input.spaceId },
    });

    if (!space) {
      throw new Error("El espacio solicitado no existe");
    }

    if (!space.isActive) {
      throw new Error("No se puede reservar un espacio desactivado");
    }

    // Regla 6: Máximo 3 reservas futuras confirmadas por usuario
    const futureConfirmedCount = await prisma.booking.count({
      where: {
        userId: input.userId,
        status: "CONFIRMED",
        startTime: { gte: new Date() },
      },
    });

    if (futureConfirmedCount >= 3) {
      throw new Error(
        "Has alcanzado el límite máximo de 3 reservas futuras confirmadas"
      );
    }

    // Regla 4: No solapamiento en el mismo espacio
    // (start < b.end && end > b.start)
    const spaceOverlap = await prisma.booking.findFirst({
      where: {
        spaceId: input.spaceId,
        status: "CONFIRMED",
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ],
      },
    });

    if (spaceOverlap) {
      throw new Error(
        "El espacio ya cuenta con una reserva confirmada en ese intervalo de tiempo"
      );
    }

    // Regla 5: No solapamiento para el mismo usuario en cualquier espacio
    const userOverlap = await prisma.booking.findFirst({
      where: {
        userId: input.userId,
        status: "CONFIRMED",
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } },
        ],
      },
    });

    if (userOverlap) {
      throw new Error(
        "Ya tienes otra reserva confirmada que se solapa con este horario"
      );
    }

    // Regla 8: El precio total lo calcula el servidor (horas * precioPorHora)
    const pricePerHour = Number(space.pricePerHour);
    const totalPrice = durationHours * pricePerHour;

    // Crear la reserva
    return prisma.booking.create({
      data: {
        userId: input.userId,
        spaceId: input.spaceId,
        startTime: start,
        endTime: end,
        totalPrice,
        status: "CONFIRMED",
      },
      include: {
        space: true,
      },
    });
  }

  /**
   * Lista las reservas del usuario autenticado (Regla 14)
   */
  static async listUserBookings(userId: string) {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        space: true,
      },
      orderBy: { startTime: "desc" },
    });
  }

  /**
   * Cancela una reserva existente (Reglas 9, 10, 11 y 14)
   */
  static async cancelBooking(bookingId: string, userId: string, userRole: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new Error("Reserva no encontrada");
    }

    // Regla 9 y 14: Solo el dueño o un administrador puede cancelarla
    if (booking.userId !== userId && userRole !== "ADMIN") {
      throw new Error("No tienes autorización para cancelar esta reserva");
    }

    if (booking.status === "CANCELLED") {
      throw new Error("La reserva ya se encuentra cancelada");
    }

    // Regla 10: Un usuario puede cancelar hasta 2 horas antes de su inicio
    if (userRole !== "ADMIN") {
      const now = new Date();
      const twoHoursBefore = new Date(booking.startTime.getTime() - 2 * 60 * 60 * 1000);

      if (now > twoHoursBefore) {
        throw new Error(
          "Solo puedes cancelar tu reserva hasta 2 horas antes de su inicio"
        );
      }
    }

    // Regla 11: Cambia su estado a CANCELLED sin eliminar el registro
    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELLED" as BookingStatus,
      },
    });
  }
}
