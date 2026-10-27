import { NextResponse } from "next/server";

// GET /api/spaces - Listar espacios activos (o todos si es admin)
export async function GET() {
  // TODO: Consultar espacios en base de datos
  return NextResponse.json({ spaces: [] });
}

// POST /api/spaces - Crear nuevo espacio (Solo Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Validar rol admin y crear espacio
    return NextResponse.json(
      { message: "Creación de espacio pendiente de implementar", space: body },
      { status: 501 }
    );
  } catch {
    return NextResponse.json({ error: "Datos de espacio inválidos" }, { status: 400 });
  }
}
