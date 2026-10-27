import { prisma } from "@/lib/prisma";
import type { SpaceType } from "@/types";
import { AdminSpaceActions } from "@/components/spaces/AdminSpaceActions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const spaces = await prisma.space.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bookings: {
        where: {
          status: "CONFIRMED",
          startTime: { gte: new Date() },
        },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Componente interactivo con encabezado, métricas, creación, edición y activación reactiva */}
      <AdminSpaceActions
        initialSpaces={spaces.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          type: s.type as SpaceType,
          capacity: s.capacity,
          pricePerHour: Number(s.pricePerHour),
          imageUrl: s.imageUrl,
          isActive: s.isActive,
          futureBookingsCount: s.bookings.length,
        }))}
      />
    </div>
  );
}
