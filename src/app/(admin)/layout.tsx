import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar de administración */}
      <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between">
        <div>
          <div className="font-bold text-xl tracking-tight text-blue-600 mb-8">
            CoSpace <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded ml-1">Admin</span>
          </div>

          <nav className="space-y-2">
            <a
              href="/admin"
              className="flex items-center gap-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
              Gestión de Espacios
            </a>
            <a
              href="/spaces"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              Vista Pública
            </a>
          </nav>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <a href="/login" className="text-sm font-medium text-red-600 hover:text-red-700">
            Salir del Panel
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-8">{children}</main>
    </div>
  );
}
