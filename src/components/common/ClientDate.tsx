"use client";

import { useSyncExternalStore } from "react";

interface ClientDateProps {
  date?: string | Date;
  fallback?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
}

const emptySubscribe = () => () => {};

/**
 * Componente seguro para evitar errores de hidratación al mostrar
 * fechas u horas locales dependientes de la zona horaria del cliente.
 */
export function ClientDate({
  date = new Date(),
  fallback = "Cargando fecha...",
  formatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
}: ClientDateProps) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isHydrated) {
    return <span className="opacity-0">{fallback}</span>;
  }

  const d = typeof date === "string" ? new Date(date) : date;
  return <span>{new Intl.DateTimeFormat(undefined, formatOptions).format(d)}</span>;
}
