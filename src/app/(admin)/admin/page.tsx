import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="text-sm text-zinc-500">
            Crea, edita y desactiva espacios de coworking.
          </p>
        </div>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
          + Nuevo Espacio
        </button>
      </div>

      {/* Tabla o listado de espacios para administración */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
        <h2 className="text-lg font-semibold mb-4">Catálogo de Espacios (Admin)</h2>
        <p className="text-sm text-zinc-500">
          Listado de escritorios, salas de reunión y cabinas con acciones de edición y desactivación.
        </p>
      </div>
    </div>
  );
}
