import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import type { SpaceType } from "@/types";

interface SpaceCardProps {
  id: string;
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  pricePerHour: number | string;
  imageUrl?: string | null;
}

const TYPE_LABELS: Record<SpaceType, { label: string; color: string }> = {
  DESK: { label: "Escritorio", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300" },
  MEETING_ROOM: { label: "Sala de Reuniones", color: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300" },
  CABIN: { label: "Cabina Acústica", color: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300" },
};

export function SpaceCard({
  id,
  name,
  description,
  type,
  capacity,
  pricePerHour,
  imageUrl,
}: SpaceCardProps) {
  const typeInfo = TYPE_LABELS[type] || { label: type, color: "bg-zinc-100 text-zinc-800" };
  const fallbackImage =
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="glass-card group flex flex-col rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] dark:backdrop-blur-md overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300">
      {/* Requisito 11: Optimización de imágenes con next/image */}
      <div
        className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800"
        style={{ position: "relative" }}
      >
        <Image
          src={imageUrl || fallbackImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-xs ${typeInfo.color}`}>
            {typeInfo.label}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {name}
            </h3>
            <span className="text-xs text-zinc-500 flex items-center gap-1 shrink-0">
              <Users className="h-3.5 w-3.5 text-zinc-400" />
              <span>{capacity} {capacity === 1 ? "persona" : "personas"}</span>
            </span>
          </div>

          <p className="text-xs text-zinc-500 line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 block font-medium">Tarifa</span>
            <span className="text-base font-extrabold text-zinc-900 dark:text-[#00d2ff]">
              ${Number(pricePerHour).toLocaleString("es-CO")}
            </span>
            <span className="text-xs text-zinc-500"> / hora</span>
          </div>

          <Link
            href={`/spaces/${id}`}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#183ebc] dark:to-[#00d2ff] px-3.5 py-2 text-xs font-semibold text-white transition shadow-xs"
          >
            Reservar
          </Link>
        </div>
      </div>
    </div>
  );
}
