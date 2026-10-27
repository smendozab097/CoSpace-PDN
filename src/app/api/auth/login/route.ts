import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Validar credenciales, generar access y refresh tokens en httpOnly cookies
    return NextResponse.json(
      { message: "Inicio de sesión pendiente de implementar", user: body.email },
      { status: 501 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Credenciales inválidas o solicitud mal formada" },
      { status: 400 }
    );
  }
}
