import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/spaces/[id]
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  return NextResponse.json({ message: `Detalle del espacio ${id} pendiente` });
}

// PUT /api/spaces/[id] - Editar espacio (Solo Admin)
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    return NextResponse.json({
      message: `Edición del espacio ${id} pendiente`,
      data: body,
    });
  } catch {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
}
