import { prisma } from "@/lib/prisma";
import { hashPassword, comparePassword, hashToken, compareToken } from "@/lib/auth";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import type { RegisterInput, LoginInput } from "@/lib/validations/auth";
import type { Role } from "@/types";

export interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Registro de un nuevo usuario
   */
  static async register(data: RegisterInput): Promise<AuthResult> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new Error("El correo electrónico ya está registrado");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "USER",
      },
    });

    // Generar tokens
    const accessToken = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    const refreshToken = await signRefreshToken({
      userId: user.id,
    });

    // Almacenar el refresh token hasheado en la base de datos (Regla 7)
    const hashedRefreshToken = await hashToken(refreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Inicio de sesión de usuario
   */
  static async login(data: LoginInput): Promise<AuthResult> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      throw new Error("Credenciales inválidas");
    }

    const accessToken = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    const refreshToken = await signRefreshToken({
      userId: user.id,
    });

    // Almacenar el refresh token hasheado
    const hashedRefreshToken = await hashToken(refreshToken);
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Renovación del access token a partir del refresh token (Regla 7)
   */
  static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; user: { id: string; email: string; role: Role } }> {
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload || !payload.userId) {
      throw new Error("Refresh token inválido o expirado");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.refreshToken) {
      throw new Error("Sesión revocada o usuario no encontrado");
    }

    // Verificar que el hash coincida
    const isValid = await compareToken(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new Error("Refresh token inválido");
    }

    // Generar nuevo access token
    const newAccessToken = await signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role as Role,
    });

    return {
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role as Role,
      },
    };
  }

  /**
   * Cierre de sesión y revocación del refresh token (Regla 7)
   */
  static async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
