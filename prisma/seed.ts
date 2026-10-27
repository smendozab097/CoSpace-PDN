import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log(" Iniciando seed de datos para CoSpace...");

  // 1. Crear o actualizar Administrador inicial
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@cospace.com" },
    update: {
      password: adminPasswordHash,
      role: "ADMIN",
    },
    create: {
      name: "Super Admin CoSpace",
      email: "admin@cospace.com",
      password: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log(`Usuario Administrador listo: ${admin.email}`);

  // 2. Crear espacios de ejemplo
  const spaces = [
    {
      name: "Escritorio Flex 101",
      description: "Puesto flexible en zona abierta, con luz natural, silla ergonómica y conexión de alta velocidad.",
      type: "DESK" as const,
      capacity: 1,
      pricePerHour: 15000,
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
    },
    {
      name: "Escritorio Dedicado 202",
      description: "Puesto fijo con monitor adicional, cajonera con llave y ambiente silencioso.",
      type: "DESK" as const,
      capacity: 1,
      pricePerHour: 22000,
      imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
    },
    {
      name: "Sala Innovación",
      description: "Sala de reuniones equipada con pantalla 4K, pizarra de cristal y sistema de videoconferencia.",
      type: "MEETING_ROOM" as const,
      capacity: 8,
      pricePerHour: 65000,
      imageUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
    },
    {
      name: "Sala Directorio Executive",
      description: "Sala ejecutiva premium para juntas directivas, con servicio de café y acústica aislada.",
      type: "MEETING_ROOM" as const,
      capacity: 14,
      pricePerHour: 95000,
      imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
    },
    {
      name: "Cabina Acústica Focus A",
      description: "Cabina insonorizada individual para llamadas confidenciales, entrevistas y concentración.",
      type: "CABIN" as const,
      capacity: 1,
      pricePerHour: 20000,
      imageUrl: "https://images.unsplash.com/photo-1590402494587-44b71d7772f6?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
    },
    {
      name: "Cabina Doble Sync B",
      description: "Cabina privada para 2 personas ideal para reuniones rápidas 1 a 1 y trabajo en pareja.",
      type: "CABIN" as const,
      capacity: 2,
      pricePerHour: 32000,
      imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
    },
  ];

  for (const space of spaces) {
    const existing = await prisma.space.findFirst({
      where: { name: space.name },
    });

    if (!existing) {
      await prisma.space.create({ data: space });
    }
  }

  console.log(`🏢 Catálogo de espacios inicializado (${spaces.length} espacios).`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("✅ Seed finalizado exitosamente.");
  })
  .catch(async (e) => {
    console.error("❌ Error en seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
