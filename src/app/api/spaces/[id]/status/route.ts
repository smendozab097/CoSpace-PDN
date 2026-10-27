import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// PATCH /api/spaces/[id]/status - Desactivar espacio (Solo Admin)
// Regla 12: Un espacio no se elimina, se desactiva.
// Regla 13: No se puede desactivar un espacio que tenga reservas futuras confirmadas.
export async function PATCH(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  return NextResponse.json({
    message: `Desactivación del espacio ${id} pendiente de implementar`,
  });
}
