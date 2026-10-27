import React from "react";

// Estrategia de renderizado: SSR (Server-Side Rendering)
export const dynamic = "force-dynamic";

export default function SpacesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Catálogo de Espacios</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Explora escritorios, salas de reuniones y cabinas disponibles para reservar.
      </p>
      
      {/* Componente SpacesList / SpaceFilters */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder para listado de espacios */}
      </div>
    </div>
  );
}
