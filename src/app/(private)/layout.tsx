import React from "react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar con menú de usuario autenticado */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-xl tracking-tight text-blue-600">CoSpace</span>
            <a href="/spaces" className="text-sm font-medium hover:text-blue-600 transition">
              Explorar Espacios
            </a>
            <a href="/dashboard" className="text-sm font-medium hover:text-blue-600 transition">
              Mis Reservas
            </a>
          </div>

          <div className="flex items-center gap-4">
            {/* Menú de usuario / Avatar / Logout */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Mi Perfil
              </span>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 bg-zinc-50 dark:bg-zinc-950">{children}</main>
    </div>
  );
}
