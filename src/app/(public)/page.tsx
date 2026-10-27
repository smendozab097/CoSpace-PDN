import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* -----------------------Hero Section----------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-zinc-50 dark:from-transparent dark:via-transparent dark:to-transparent py-20 sm:py-28 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            El espacio de trabajo ideal,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-[#00d2ff] to-[#9d50bb] bg-clip-text text-transparent">
              reservado por horas
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Reserva escritorios individuales o compartidos, salas de reuniones ejecutivas y cabinas acústicas privadas.
            Disponibilidad en tiempo real de 7:00 a 21:00.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/spaces"
              className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#183ebc] dark:to-[#00d2ff] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              Explorar Catálogo de Espacios
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-xl border border-zinc-300 dark:border-white/15 bg-white dark:bg-white/[0.04] dark:backdrop-blur-md hover:bg-zinc-50 dark:hover:bg-white/[0.08] px-6 py-3.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 transition-all duration-200"
            >
              Crear Cuenta Gratis
            </Link>
          </div>

          {/* -----------------------Quick Metrics----------------------- */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-200 dark:border-white/10 pt-8 text-left">
            <div>
              <span className="text-2xl font-black text-blue-600 dark:text-[#00d2ff]">1 a 4 hrs</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Duración en bloques enteros</p>
            </div>
            <div>
              <span className="text-2xl font-black text-blue-600 dark:text-[#00d2ff]">7am - 9pm</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Horario continuo de atención</p>
            </div>
            <div>
              <span className="text-2xl font-black text-blue-600 dark:text-[#00d2ff]">Hasta 30 días</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Anticipación para reservar</p>
            </div>
            <div>
              <span className="text-2xl font-black text-blue-600 dark:text-[#00d2ff]">2 horas</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Margen para cancelación libre</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Espacios diseñados para tu productividad
          </h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Selecciona el entorno que mejor se adapte a tu jornada de trabajo o reunión.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Desks */}
          <div className="glass-card rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/[0.03] dark:backdrop-blur-md p-6 flex flex-col justify-between shadow-xs transition hover:shadow-lg">
            <div>
              <div
                className="relative h-44 w-full rounded-xl overflow-hidden mb-4"
                style={{ position: "relative" }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                  alt="Escritorios Flex"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Escritorios Dedicados y Compartidos</h3>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Puestos individuales con monitores, luz natural y sillas ergonómicas de alta gama.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/10 flex justify-between items-center">
              <span className="text-xs font-semibold text-blue-600 dark:text-[#00d2ff]">Desde $15.000 / hr</span>
              <Link href="/spaces" className="inline-flex items-center gap-1 text-xs font-semibold hover:underline text-zinc-700 dark:text-zinc-200">
                <span>Ver opciones</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Card 2: Meeting Rooms */}
          <div className="glass-card rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-white/[0.03] dark:backdrop-blur-md p-6 flex flex-col justify-between shadow-xs transition hover:shadow-lg">
            <div>
              <div
                className="relative h-44 w-full rounded-xl overflow-hidden mb-4"
                style={{ position: "relative" }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80"
                  alt="Salas de Reuniones"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Salas de Reuniones</h3>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Espacios para juntas y presentaciones con pantallas 4K, sonido envolvente y pizarras.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/10 flex justify-between items-center">
              <span className="text-xs font-semibold text-blue-600 dark:text-[#00d2ff]">Hasta 14 personas</span>
              <Link href="/spaces" className="inline-flex items-center gap-1 text-xs font-semibold hover:underline text-zinc-700 dark:text-zinc-200">
                <span>Ver opciones</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Card 3: Cabins */}
          <div className="glass-card rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-white/[0.03] dark:backdrop-blur-md p-6 flex flex-col justify-between shadow-xs transition hover:shadow-lg">
            <div>
              <div
                className="relative h-44 w-full rounded-xl overflow-hidden mb-4"
                style={{ position: "relative" }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1590402494587-44b71d7772f6?auto=format&fit=crop&w=600&q=80"
                  alt="Cabinas Acústicas"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Cabinas Acústicas Focus</h3>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Insonorización certificada para llamadas confidenciales, entrevistas y webinars.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/10 flex justify-between items-center">
              <span className="text-xs font-semibold text-blue-600 dark:text-[#00d2ff]">Privacidad total</span>
              <Link href="/spaces" className="inline-flex items-center gap-1 text-xs font-semibold hover:underline text-zinc-700 dark:text-zinc-200">
                <span>Ver opciones</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
