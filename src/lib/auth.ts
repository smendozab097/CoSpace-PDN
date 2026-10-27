import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { verifyAccessToken, type TokenPayload } from "./jwt";
import { ACCESS_TOKEN_COOKIE } from "./cookies";

const SALT_ROUNDS = 10;

/**
 * Hashea una contraseña de forma segura
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compara una contraseña en texto plano con un hash almacenado
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Hashea el refresh token para almacenarlo en la base de datos (Regla 7)
 */
export async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, SALT_ROUNDS);
}

/**
 * Compara un refresh token recibido con su hash en la base de datos
 */
export async function compareToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

/**
 * Obtiene el usuario autenticado actual desde las cookies de la petición
 */
export async function getCurrentUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifyAccessToken(token);
}

/**
 * Valida que el usuario esté autenticado en el route handler (sin depender solo del proxy)
 */
export async function requireUser(): Promise<{ user: TokenPayload } | { error: string; status: number }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "No autenticado. Por favor inicia sesión.", status: 401 };
  }
  return { user };
}

/**
 * Valida que el usuario tenga rol de administrador (ADMIN)
 */
export async function requireAdmin(): Promise<{ user: TokenPayload } | { error: string; status: number }> {
  const authResult = await requireUser();
  if ("error" in authResult) {
    return authResult;
  }

  if (authResult.user.role !== "ADMIN") {
    return { error: "Acceso denegado. Se requiere rol de Administrador.", status: 403 };
  }

  return authResult;
}
