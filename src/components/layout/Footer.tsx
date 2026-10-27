import { Clock } from "lucide-react";
import { ClientDate } from "../common/ClientDate";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-[#03030c]/90 py-10 px-6 transition-colors">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">CoSpace</span>
          <span>&copy; {new Date().getFullYear()}</span>
          <span>• Todos los derechos reservados</span>
        </div>

        {/* Requisito 10 de Hidratación: componente dependiente de hora local del cliente sin errores */}
        <div className="inline-flex items-center gap-1.5 text-xs bg-zinc-100 dark:bg-white/[0.04] px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/10">
          <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-[#00d2ff]" />
          <span>Hora local:</span>
          <ClientDate />
        </div>
      </div>
    </footer>
  );
}
