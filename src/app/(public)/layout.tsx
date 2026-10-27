import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">

      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="font-bold text-xl tracking-tight">CoSpace</span>
          <div className="flex items-center gap-4 text-sm font-medium">
            <a href="/" className="hover:text-blue-600 transition-colors">Inicio</a>
            <a href="/spaces" className="hover:text-blue-600 transition-colors">Espacios</a>
            <a href="/login" className="hover:text-blue-600 transition-colors">Ingresar</a>
            <a href="/register" className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-white hover:bg-blue-700 transition-colors">Registrarse</a>
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-6 text-center text-sm text-zinc-500">
        <p>&copy; {new Date().getFullYear()} CoSpace. Plataforma de reservas de coworking.</p>
      </footer>
    </div>
  );
}
