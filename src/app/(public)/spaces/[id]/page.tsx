import React from "react";

// Estrategia de renderizado: SSR (Server-Side Rendering)
export const dynamic = "force-dynamic";

interface SpaceDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SpaceDetailPage({ params }: SpaceDetailPageProps) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Detalle del Espacio #{id}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Información detallada, disponibilidad y formulario de reserva.
      </p>

      {/* Aquí se integrarán SpaceDetail y BookingForm */}
    </div>
  );
}
