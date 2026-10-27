"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { ClientDate } from "@/components/common/ClientDate";
import type { BookingStatus } from "@/types";

interface BookingItem {
  id: string;
  spaceId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  space?: {
    name: string;
    type: string;
  };
}

// Requisito 4: Estrategia de renderizado CSR (Client-Side Rendering)
export default function UserDashboardPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    let ignore = false;
    async function loadBookings() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (!ignore && res.ok && data.data) {
          setBookings(data.data);
        }
      } catch (err) {
        console.error("Error al cargar reservas:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    loadBookings();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      return;
    }

    setCancellingId(bookingId);
    setMessage(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo cancelar la reserva");
      }

      setMessage({ text: "Reserva cancelada exitosamente", type: "success" });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setMessage({ text: (err as Error).message, type: "error" });
    } finally {
      setCancellingId(null);
    }
  };

  const activeConfirmed = bookings.filter(
    (b) => b.status === "CONFIRMED" && new Date(b.startTime) >= new Date()
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            Mi Espacio de Trabajo
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
            Mis Reservas
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Administra tus reservas activas e historial de espacios de coworking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-xl">
            <span className="text-zinc-500">Reservas futuras: </span>
            <strong className="text-blue-600">{activeConfirmed.length} / 3 máx.</strong>
          </div>
          <Link
            href="/spaces"
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition"
          >
            + Nueva Reserva
          </Link>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl p-4 text-xs font-medium border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-sm text-zinc-500">
          Cargando tus reservas...
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-12 text-center bg-white dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            No tienes reservas registradas.
          </p>
          <p className="text-xs text-zinc-500 mt-1 mb-5">
            Explora escritorios, salas y cabinas disponibles para reservar por horas.
          </p>
          <Link
            href="/spaces"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
          >
            Explorar Catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isConfirmed = booking.status === "CONFIRMED";
            const start = new Date(booking.startTime);
            const now = new Date();
            const twoHoursBefore = new Date(start.getTime() - 2 * 60 * 60 * 1000);
            const canCancel = isConfirmed && now <= twoHoursBefore;

            return (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-xs hover:border-zinc-300 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                      {booking.space?.name || "Espacio CoSpace"}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        isConfirmed
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}
                    >
                      {isConfirmed ? "Confirmada" : "Cancelada"}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-500 flex flex-wrap gap-x-4 gap-y-1">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Inicio:</span>
                      <ClientDate date={booking.startTime} />
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Fin:</span>
                      <ClientDate date={booking.endTime} />
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                      Total Pagado
                    </span>
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                      ${Number(booking.totalPrice).toLocaleString("es-CO")}
                    </span>
                  </div>

                  {isConfirmed && (
                    <div>
                      {canCancel ? (
                        <button
                          type="button"
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                        >
                          {cancellingId === booking.id ? "Cancelando..." : "Cancelar"}
                        </button>
                      ) : (
                        <span className="text-[11px] text-zinc-400 italic">
                          Menos de 2h (no cancelable)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
