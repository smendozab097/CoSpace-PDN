import { prisma } from "@/lib/prisma";
import type { CreateSpaceInput, UpdateSpaceInput } from "@/lib/validations/spaces";

export class SpacesService {
  /**
   * Catálogo público: Lista únicamente los espacios activos (Regla 12)
   */
  static async listActive() {
    return prisma.space.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Panel de administración: Lista todos los espacios (activos e inactivos)
   */
  static async listAllAdmin() {
    return prisma.space.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Obtiene el detalle de un espacio por su ID
   */
  static async getById(id: string) {
    return prisma.space.findUnique({
      where: { id },
    });
  }

  /**
   * Crea un nuevo espacio (Solo administradores)
   */
  static async create(data: CreateSpaceInput) {
    return prisma.space.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        capacity: data.capacity,
        pricePerHour: data.pricePerHour,
        imageUrl: data.imageUrl,
        isActive: true,
      },
    });
  }

  /**
   * Edita un espacio existente (Solo administradores)
   */
  static async update(id: string, data: UpdateSpaceInput) {
    const existing = await prisma.space.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Espacio no encontrado");
    }

    return prisma.space.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.capacity !== undefined && { capacity: data.capacity }),
        ...(data.pricePerHour !== undefined && { pricePerHour: data.pricePerHour }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
      },
    });
  }

  /**
   * Cambia el estado de un espacio (activar o desactivar).
   * Regla 12: No se elimina, se desactiva.
   * Regla 13: No se puede desactivar un espacio que tenga reservas futuras confirmadas.
   */
  static async setStatus(id: string, targetActive?: boolean) {
    const space = await prisma.space.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: "CONFIRMED",
            startTime: { gte: new Date() },
          },
        },
      },
    });

    if (!space) {
      throw new Error("Espacio no encontrado");
    }

    const newActiveState =
      targetActive !== undefined ? targetActive : !space.isActive;

    // Regla 13: Validar que no tenga reservas futuras confirmadas solo al intentar desactivar
    if (!newActiveState && space.bookings.length > 0) {
      throw new Error(
        "No se puede desactivar un espacio que tenga reservas futuras confirmadas"
      );
    }

    return prisma.space.update({
      where: { id },
      data: { isActive: newActiveState },
    });
  }

  /**
   * Desactiva un espacio (Regla 12 y 13)
   */
  static async deactivate(id: string) {
    return this.setStatus(id, false);
  }

  /**
   * Reactiva un espacio previamente desactivado
   */
  static async activate(id: string) {
    return this.setStatus(id, true);
  }
}
