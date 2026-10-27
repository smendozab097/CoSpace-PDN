import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Revocar refresh token en la base de datos y limpiar cookies
  const response = NextResponse.json({ message: "Sesión cerrada exitosamente" });
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");
  return response;
}
