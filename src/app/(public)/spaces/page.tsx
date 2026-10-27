import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SpaceCard } from "@/components/spaces/SpaceCard";
import type { SpaceType } from "@/types";

// Requisito 4: Estrategia de renderizado SSR (Server-Side Rendering)
export const dynamic = "force-dynamic";

export default async function SpacesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  // Filtrar por tipo si se especifica en la URL
  const whereClause = {
    isActive: true, // Regla 12: Solo espacios activos en el catálogo público
    ...(type && ["DESK", "MEETING_ROOM", "CABIN"].includes(type)
      ? { type: type as SpaceType }
      : {}),
  };

  const spaces = await prisma.space.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  const categories = [
    { label: "Todos los espacios", value: "" },
    { label: "Escritorios", value: "DESK" },
    { label: "Salas de Reuniones", value: "MEETING_ROOM" },
    { label: "Cabinas Acústicas", value: "CABIN" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Catálogo CoSpace
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            Espacios Disponibles
          </h1>
          <p className="mt-2 text-sm text-zinc-500 max-w-xl">
            Explora y reserva puestos de trabajo flexibles, salas y cabinas por horas con confirmación en el servidor.
          </p>
        </div>

        {/* Contador de resultados */}
        <div className="text-xs font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3.5 py-1.5 rounded-full self-start md:self-auto">
          {spaces.length} {spaces.length === 1 ? "espacio activo" : "espacios activos"}
        </div>
      </div>

      {/* Filtros por Categoría */}
      <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        {categories.map((cat) => {
          const isActive = (!type && cat.value === "") || type === cat.value;
          const href = cat.value ? `/spaces?type=${cat.value}` : "/spaces";

          return (
            <Link
              key={cat.label}
              href={href}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-blue-400"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Grid de Espacios */}
      {spaces.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center">
          <p className="text-sm text-zinc-500">
            No se encontraron espacios disponibles para este filtro.
          </p>
          <Link
            href="/spaces"
            className="mt-4 inline-block text-xs font-semibold text-blue-600 hover:underline"
          >
            Ver todos los espacios
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard
              key={space.id}
              id={space.id}
              name={space.name}
              description={space.description}
              type={space.type as SpaceType}
              capacity={space.capacity}
              pricePerHour={Number(space.pricePerHour)}
              imageUrl={space.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
