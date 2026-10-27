import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Leer refresh token de cookies, validar hash en DB, renovar access token
  return NextResponse.json(
    { message: "Refresh token pendiente de implementar" },
    { status: 501 }
  );
}
