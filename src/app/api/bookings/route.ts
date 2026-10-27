import { NextResponse } from "next/server";

// GET /api/bookings - Listar reservas del usuario autenticado
export async function GET() {
  // TODO: Obtener userId del token en cookies y listar solo sus reservas
  return NextResponse.json({ bookings: [] });
}

// POST /api/bookings - Crear reserva
// Reglas:
// 1. Duración 1 a 4 horas completas (ej: 10:00 a 12:00)
// 2. Solo entre las 7:00 y las 21:00
// 3. No en el pasado ni con más de 30 días de anticipación
// 4. No solapamiento en el mismo espacio
// 5. No solapamiento para el mismo usuario
// 6. Máximo 3 reservas futuras confirmadas por usuario
// 7. No reservar espacio desactivado
// 8. Precio calculado en el servidor (horas * precioPorHora)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json(
      { message: "Creación de reserva pendiente de implementar", data: body },
      { status: 501 }
    );
  } catch {
    return NextResponse.json({ error: "Datos de reserva inválidos" }, { status: 400 });
  }
}
