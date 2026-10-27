import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PATCH /api/bookings/[id]/cancel
// Reglas:
// 9. Solo dueño o administrador.
// 10. Cancelable hasta 2 horas antes del inicio.
// 11. Cambia estado a CANCELADA, no se elimina de la base de datos.
export async function PATCH(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  return NextResponse.json({
    message: `Cancelación de reserva ${id} pendiente de implementar`,
  });
}
