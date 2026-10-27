// Prisma Client Singleton para Next.js
// Evita múltiples instancias en modo desarrollo con Hot Module Reloading

export interface PrismaPlaceholder {
  user?: unknown;
  space?: unknown;
  booking?: unknown;
}

// TODO: Al ejecutar `npx prisma init` e instalar `@prisma/client`,
// descomentar el cliente real tipado:
/*
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
*/

export const prisma: PrismaPlaceholder = {};
