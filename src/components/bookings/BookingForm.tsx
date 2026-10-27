"use client";

import { useState, useEffect, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface BookingFormProps {
  spaceId: string;
  pricePerHour: number;
}

export function BookingForm({ spaceId, pricePerHour }: BookingFormProps) {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [dateLimits, setDateLimits] = useState<{ today: string; maxDate: string }>({
    today: "",
    maxDate: "",
  });

  useEffect(() => {
    const now = new Date();
    const t = now.toISOString().split("T")[0];
    const m = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    queueMicrotask(() => {
      setDateLimits({ today: t, maxDate: m });
      setDate(t);
    });
  }, []);
  const [startHour, setStartHour] = useState("09"); // 09:00
  const [duration, setDuration] = useState("1"); // 1 hora
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cálculo del precio en cliente solo como preview informativo (el servidor lo recalcula estrictamente)
  const durationNum = parseInt(duration, 10);
  const estimatedTotal = durationNum * pricePerHour;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const startHourNum = parseInt(startHour, 10);
      const endHourNum = startHourNum + durationNum;

      if (endHourNum > 21) {
        throw new Error("La reserva no puede terminar después de las 21:00");
      }

      // Formatear fechas ISO exactas con hora completa
      const startTime = new Date(`${date}T${startHour.padStart(2, "0")}:00:00`);
      const endTime = new Date(
        `${date}T${String(endHourNum).padStart(2, "0")}:00:00`
      );

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?from=/spaces/${spaceId}`);
          return;
        }
        throw new Error(data.error || "No fue posible crear la reserva");
      }

      setSuccess("¡Reserva confirmada con éxito! Redirigiendo a tus reservas...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Horas de inicio disponibles (07:00 a 20:00)
  const availableStartHours = Array.from({ length: 14 }, (_, i) => i + 7);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
      <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">
        Reservar este espacio
      </h3>
      <p className="text-xs text-zinc-500 mb-5">
        Elige fecha, hora de inicio y duración (horas completas de 7:00 a 21:00).
      </p>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-3 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 p-3 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Fecha de reserva (máx. 30 días)
          </label>
          <input
            type="date"
            required
            min={dateLimits.today}
            max={dateLimits.maxDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Hora de Inicio
            </label>
            <select
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition"
            >
              {availableStartHours.map((hour) => (
                <option key={hour} value={String(hour).padStart(2, "0")}>
                  {String(hour).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Duración (1 a 4 hrs)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none transition"
            >
              <option value="1">1 hora</option>
              <option value="2">2 horas</option>
              <option value="3">3 horas</option>
              <option value="4">4 horas</option>
            </select>
          </div>
        </div>

        {/* Resumen del cálculo en el servidor */}
        <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-4 border border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between text-xs text-zinc-500 mb-1">
            <span>Tarifa por hora:</span>
            <span>${pricePerHour.toLocaleString("es-CO")}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-500 mb-2">
            <span>Horas reservadas:</span>
            <span>{duration} hora(s)</span>
          </div>
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Total Calculado:
            </span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">
              ${estimatedTotal.toLocaleString("es-CO")}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || Boolean(success)}
          className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Confirmando reserva..." : "Confirmar Reserva"}
        </button>
      </form>
    </div>
  );
}
