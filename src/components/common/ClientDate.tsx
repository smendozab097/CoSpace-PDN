"use client";

import React, { useEffect, useState } from "react";

interface ClientDateProps {
  date?: string | Date;
  fallback?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
}

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
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    const d = typeof date === "string" ? new Date(date) : date;
    setFormattedDate(new Intl.DateTimeFormat(undefined, formatOptions).format(d));
  }, [date, formatOptions]);

  if (!formattedDate) {
    return <span className="opacity-0">{fallback}</span>;
  }

  return <span>{formattedDate}</span>;
}
