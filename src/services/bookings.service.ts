/**
 * Servicio de negocio para la gestión de reservas CoSpace
 * Implementa las reglas del assessment:
 * 1. Duración entre 1 y 4 horas en horas completas.
 * 2. Horario permitido entre 7:00 y 21:00.
 * 3. No reservar en el pasado ni con más de 30 días de anticipación.
 * 4. No solapamiento de reservas en el mismo espacio.
 * 5. No solapamiento de reservas para el mismo usuario.
 * 6. Máximo 3 reservas futuras confirmadas por usuario.
 * 7. No reservar espacios desactivados.
 * 8. Cálculo de precio total en el servidor (horas * precioPorHora).
 * 9. Solo dueño o admin puede cancelar.
 * 10. Cancelación permitida hasta 2 horas antes del inicio.
 * 11. Cambiar estado a CANCELLED sin eliminar registro.
 */

export interface CreateBookingDTO {
  userId: string;
  spaceId: string;
  startTime: Date;
  endTime: Date;
}

export class BookingsService {
  /**
   * Valida las reglas de horario, duración y anticipación de la reserva.
   */
  static validateBookingConstraints(startTime: Date, endTime: Date): { isValid: boolean; error?: string; durationHours?: number } {
    const now = new Date();

    // Regla 3: No en el pasado
    if (startTime <= now) {
      return { isValid: false, error: "No se puede reservar en el pasado." };
    }

    // Regla 3: No más de 30 días de anticipación
    const maxFutureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (startTime > maxFutureDate) {
      return { isValid: false, error: "No se puede reservar con más de 30 días de anticipación." };
    }

    // Regla 1: Horas completas (sin minutos ni segundos residuales)
    if (
      startTime.getMinutes() !== 0 ||
      startTime.getSeconds() !== 0 ||
      endTime.getMinutes() !== 0 ||
      endTime.getSeconds() !== 0
    ) {
      return { isValid: false, error: "Las reservas deben ser en horas completas (ej: de 10:00 a 12:00)." };
    }

    // Regla 1: Duración entre 1 y 4 horas
    const diffMs = endTime.getTime() - startTime.getTime();
    const durationHours = diffMs / (1000 * 60 * 60);

    if (durationHours < 1 || durationHours > 4) {
      return { isValid: false, error: "La reserva debe durar entre 1 y 4 horas." };
    }

    // Regla 2: Solo entre las 7:00 y las 21:00
    const startHour = startTime.getHours();
    const endHour = endTime.getHours();

    if (startHour < 7 || endHour > 21 || (endHour === 21 && endTime.getMinutes() > 0)) {
      return { isValid: false, error: "Las reservas solo están permitidas entre las 07:00 y las 21:00." };
    }

    return { isValid: true, durationHours };
  }

  /**
   * Valida si una reserva puede ser cancelada.
   * Regla 10: Un usuario puede cancelar su reserva hasta 2 horas antes de su inicio.
   */
  static canCancelBooking(startTime: Date): boolean {
    const now = new Date();
    const twoHoursBefore = new Date(startTime.getTime() - 2 * 60 * 60 * 1000);
    return now <= twoHoursBefore;
  }
}
