"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

function subscribeSidebar(callback: () => void) {
  window.addEventListener("cospace-sidebar-collapse", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("cospace-sidebar-collapse", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSidebarSnapshot(): boolean {
  try {
    return localStorage.getItem("cospace_admin_sidebar_collapsed") === "true";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const collapsed = useSyncExternalStore(
    subscribeSidebar,
    getSidebarSnapshot,
    getServerSnapshot
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleCollapse = () => {
    const next = !collapsed;
    try {
      localStorage.setItem("cospace_admin_sidebar_collapsed", String(next));
      window.dispatchEvent(new CustomEvent("cospace-sidebar-collapse"));
    } catch {
      // Ignore
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-transparent">
      {/* Backdrop para drawer móvil */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Barra lateral / Drawer administrativo */}
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Contenedor principal derecho (min-w-0 para evitar desbordamientos flex) */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Barra superior visible en móviles y tablets (< lg) */}
        <header className="sticky top-0 z-30 lg:hidden flex items-center justify-between px-4 py-3 bg-[#03030c]/90 backdrop-blur-md border-b border-white/10 transition-colors shadow-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menú"
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 active:scale-95 transition cursor-pointer shadow-2xs"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/logo-icon.png"
                alt="CoSpace"
                width={30}
                height={30}
                className="h-7 w-auto shrink-0"
              />
              <span className="font-bold text-sm text-zinc-100">
                CoSpace{" "}
                <span className="text-[10px] text-[#00d2ff]">
                  ADMIN
                </span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle darkSurface />
            <LanguageSwitcher compact darkSurface />
          </div>
        </header>

        {/* Área de contenido con scroll vertical y padding adaptativo */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
