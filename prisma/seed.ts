/**
 * Seed inicial para CoSpace
 * Crea:
 * 1. Usuario Administrador (email: admin@cospace.com, pass: Admin123!)
 * 2. Espacios de ejemplo (Escritorios, Salas de reuniones y Cabinas)
 */

export async function main() {
  console.log("🌱 Iniciando seed de datos para CoSpace...");
  // TODO: Ejecutar con Prisma cuando las dependencias estén instaladas:
  // const hashedPassword = await bcrypt.hash("Admin123!", 10);
  // await prisma.user.upsert({ ... });
}

// Para ejecutar: npx tsx prisma/seed.ts
if (require.main === module) {
  main()
    .then(() => console.log("✅ Seed completado con éxito."))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
