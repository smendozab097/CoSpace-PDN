import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200, message?: string) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(message && { message }),
    },
    { status }
  );
}

export function errorResponse(error: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(details !== undefined && { details }),
    },
    { status }
  );
}

export const HttpError = {
  badRequest: (msg = "Solicitud inválida", details?: unknown) =>
    errorResponse(msg, 400, details),
  unauthorized: (msg = "No autorizado") => errorResponse(msg, 401),
  forbidden: (msg = "Acceso denegado") => errorResponse(msg, 403),
  notFound: (msg = "Recurso no encontrado") => errorResponse(msg, 404),
  conflict: (msg = "Conflicto con el recurso actual") => errorResponse(msg, 409),
  serverError: (msg = "Error interno del servidor") => errorResponse(msg, 500),
};
