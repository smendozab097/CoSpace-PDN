"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Building2,
  Globe,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  X,
} from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { t, locale } = useLanguage();

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const collapseTooltip =
    locale === "es" ? "Contraer menú lateral" : "Collapse sidebar";
  const expandTooltip =
    locale === "es" ? "Expandir menú lateral" : "Expand sidebar";

  return (
    <>
      {/* 1. Mobile Drawer (pantallas < lg) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#03030c] border-r border-zinc-200 dark:border-white/10 p-6 shadow-2xl flex flex-col justify-between lg:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header Mobile Drawer */}
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-zinc-100 dark:border-white/5">
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className="flex items-center gap-2"
            >
              <Image
                src="/logo-icon.png"
                alt="CoSpace"
                width={34}
                height={34}
                className="h-8 w-auto shrink-0"
                priority
              />
              <div className="relative flex items-center">
                <Image
                  src="/logo-brand-light.png"
                  alt="CoSpace"
                  width={105}
                  height={34}
                  className="h-6 w-auto dark:hidden"
                  priority
                />
                <Image
                  src="/logo-brand.png"
                  alt="CoSpace"
                  width={105}
                  height={34}
                  className="h-6 w-auto hidden dark:block"
                  priority
                />
              </div>
              <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-[#00d2ff] px-1.5 py-0.5 rounded font-extrabold ml-1">
                ADMIN
              </span>
            </Link>

            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navegación Mobile Drawer */}
          <nav className="space-y-1.5">
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                pathname === "/admin"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              <span>{t.admin.spacesManagement}</span>
            </Link>
            <Link
              href="/spaces"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                pathname.startsWith("/spaces")
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span>{t.admin.publicView}</span>
            </Link>
          </nav>
        </div>

        {/* Footer Mobile Drawer */}
        <div className="space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400">{t.admin.sidebar.theme}</span>
            <ThemeToggle />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-zinc-400">
              {t.admin.sidebar.language}
            </span>
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>{t.nav.logout}</span>
          </button>
        </div>
      </aside>

      {/* 2. Desktop Collapsible Sidebar (pantallas >= lg) */}
      <aside
        className={`hidden lg:flex flex-col justify-between shrink-0 border-r border-zinc-200 dark:border-white/10 bg-white dark:bg-[#03030c] transition-all duration-300 ease-in-out ${
          collapsed ? "w-20 p-3.5" : "w-64 p-6"
        }`}
      >
        <div>
          {/* Header Desktop Sidebar */}
          <div
            className={`flex items-center mb-8 ${
              collapsed ? "flex-col gap-3 justify-center" : "justify-between"
            }`}
          >
            <Link href="/admin" className="flex items-center gap-2 min-w-0">
              <Image
                src="/logo-icon.png"
                alt="CoSpace"
                width={34}
                height={34}
                className="h-8 w-auto shrink-0"
                priority
              />
              {!collapsed && (
                <>
                  <div className="relative flex items-center">
                    <Image
                      src="/logo-brand-light.png"
                      alt="CoSpace"
                      width={105}
                      height={34}
                      className="h-6 w-auto dark:hidden"
                      priority
                    />
                    <Image
                      src="/logo-brand.png"
                      alt="CoSpace"
                      width={105}
                      height={34}
                      className="h-6 w-auto hidden dark:block"
                      priority
                    />
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-[#00d2ff] px-1.5 py-0.5 rounded font-extrabold ml-1">
                    ADMIN
                  </span>
                </>
              )}
            </Link>

            {/* Botón para recoger/expandir el sidebar */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                title={collapsed ? expandTooltip : collapseTooltip}
                aria-label={collapsed ? expandTooltip : collapseTooltip}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-white/10 transition active:scale-95 cursor-pointer shadow-2xs"
              >
                {collapsed ? (
                  <PanelLeft className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Navegación Desktop */}
          <nav className="space-y-1.5">
            <Link
              href="/admin"
              title={collapsed ? t.admin.spacesManagement : undefined}
              className={`flex items-center rounded-xl transition ${
                collapsed
                  ? "h-11 w-11 mx-auto justify-center"
                  : "gap-3 px-3.5 py-2.5 text-xs font-bold"
              } ${
                pathname === "/admin"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{t.admin.spacesManagement}</span>}
            </Link>

            <Link
              href="/spaces"
              title={collapsed ? t.admin.publicView : undefined}
              className={`flex items-center rounded-xl transition ${
                collapsed
                  ? "h-11 w-11 mx-auto justify-center"
                  : "gap-3 px-3.5 py-2.5 text-xs font-semibold"
              } ${
                pathname.startsWith("/spaces")
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <Globe className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{t.admin.publicView}</span>}
            </Link>
          </nav>
        </div>

        {/* Footer Desktop */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
          {!collapsed ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">
                  {t.admin.sidebar.theme}
                </span>
                <ThemeToggle />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">
                  {t.admin.sidebar.language}
                </span>
                <LanguageSwitcher />
              </div>

              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95 transition cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>{t.nav.logout}</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <ThemeToggle />
              <LanguageSwitcher compact />
              <button
                type="button"
                onClick={logout}
                title={t.nav.logout}
                aria-label={t.nav.logout}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 active:scale-95 transition cursor-pointer shadow-2xs"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
