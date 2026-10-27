import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, DollarSign, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/bookings/BookingForm";
import type { SpaceType } from "@/types";

// Requisito 4: Estrategia de renderizado SSR (Server-Side Rendering)
export const dynamic = "force-dynamic";

interface SpaceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const TYPE_NAMES: Record<SpaceType, string> = {
  DESK: "Escritorio Dedicado / Flex",
  MEETING_ROOM: "Sala de Reuniones",
  CABIN: "Cabina Acústica Individual",
};

export default async function SpaceDetailPage({ params }: SpaceDetailPageProps) {
  const { id } = await params;

  const space = await prisma.space.findUnique({
    where: { id },
  });

  if (!space || !space.isActive) {
    notFound();
  }

  const fallbackImage =
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Migas de pan */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-blue-600">
          Inicio
        </Link>
        <span>/</span>
        <Link href="/spaces" className="hover:text-blue-600">
          Espacios
        </Link>
        <span>/</span>
        <span className="text-zinc-800 dark:text-zinc-200 font-medium">
          {space.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Columna Izquierda: Información del Espacio */}
        <div className="lg:col-span-2">
          {/* Imagen optimizada con next/image (Requisito 11) */}
          <div
            className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md bg-zinc-100 dark:bg-zinc-800 mb-8"
            style={{ position: "relative" }}
          >
            <Image
              src={space.imageUrl || fallbackImage}
              alt={space.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-zinc-900/90 text-blue-600 shadow-sm backdrop-blur-xs">
                {TYPE_NAMES[space.type as SpaceType]}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
            {space.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 py-4 border-y border-zinc-200 dark:border-zinc-800 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Capacidad:</span>
              <strong className="text-zinc-900 dark:text-zinc-100">
                {space.capacity} {space.capacity === 1 ? "persona" : "personas"}
              </strong>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Tarifa:</span>
              <strong className="text-blue-600 text-base">
                ${Number(space.pricePerHour).toLocaleString("es-CO")}
              </strong>
              <span>/ hora</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>Horario:</span>
              <strong className="text-zinc-900 dark:text-zinc-100">07:00 a 21:00</strong>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Descripción del espacio
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {space.description}
            </p>
          </div>

          <div className="mt-8 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-2">
              Reglas de Reserva CoSpace
            </h3>
            <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 list-disc list-inside">
              <li>Duración entre 1 y 4 horas en bloques completos.</li>
              <li>Cancelación sin penalidad hasta 2 horas antes del inicio.</li>
              <li>Máximo 3 reservas activas confirmadas por usuario.</li>
              <li>El precio final se calcula y valida en el servidor.</li>
            </ul>
          </div>
        </div>

        {/* Columna Derecha: Formulario de Reserva */}
        <div>
          <div className="sticky top-24">
            <BookingForm
              spaceId={space.id}
              pricePerHour={Number(space.pricePerHour)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
