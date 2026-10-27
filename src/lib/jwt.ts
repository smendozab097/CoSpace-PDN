import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/types";

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
  [key: string]: unknown;
}

const ACCESS_SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET || "default_access_secret_cospace_at_least_32_chars_long!!"
);

const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET || "default_refresh_secret_cospace_at_least_32_chars_long!"
);

/**
 * Genera un Access Token JWT con expiración corta (15m por defecto)
 */
export async function signAccessToken(payload: TokenPayload): Promise<string> {
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(ACCESS_SECRET);
}

/**
 * Genera un Refresh Token JWT con expiración larga (7d por defecto)
 */
export async function signRefreshToken(payload: { userId: string }): Promise<string> {
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(REFRESH_SECRET);
}

/**
 * Verifica un Access Token JWT
 */
export async function verifyAccessToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Verifica un Refresh Token JWT
 */
export async function verifyRefreshToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return payload as unknown as { userId: string };
  } catch {
    return null;
  }
}
