"use client";

// Estrategia de renderizado: CSR (Client-Side Rendering)
import React, { useState, useEffect } from "react";

export default function UserDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // TODO: Cargar reservas del usuario desde /api/bookings
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Reservas</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Administra tus reservas activas y consulta tu historial.
          </p>
        </div>
        <a
          href="/spaces"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Nueva Reserva
        </a>
      </div>

      {/* Listado de reservas */}
      <div className="mt-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <p className="text-sm text-zinc-500 text-center py-8">
          No tienes reservas activas en este momento.
        </p>
      </div>
    </div>
  );
}
