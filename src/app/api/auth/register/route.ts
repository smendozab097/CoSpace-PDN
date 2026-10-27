import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Implementar registro con hash de contraseña
    return NextResponse.json(
      { message: "Registro pendiente de implementar", data: body },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error procesando la solicitud", details: (error as Error).message },
      { status: 400 }
    );
  }
}
