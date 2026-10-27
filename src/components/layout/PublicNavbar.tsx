"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export function PublicNavbar() {
  const { t } = useLanguage();
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#03030c]/90 backdrop-blur-md px-6 py-3 transition-colors shadow-lg shadow-black/20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo-icon.png"
            alt="CoSpace Emblem"
            width={38}
            height={38}
            className="h-9 w-auto shrink-0"
            priority
          />
          <div className="relative flex items-center">
            <Image
              src="/logo-brand.png"
              alt="CoSpace"
              width={130}
              height={42}
              className="h-8 w-auto block"
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-5 text-sm font-medium">
            <Link
              href="/"
              className={`transition ${
                pathname === "/"
                  ? "text-[#00d2ff] font-semibold"
                  : "text-zinc-300 hover:text-[#00d2ff]"
              }`}
            >
              {t.nav.home}
            </Link>
            <Link
              href="/spaces"
              className={`transition ${
                pathname.startsWith("/spaces")
                  ? "text-[#00d2ff] font-semibold"
                  : "text-zinc-300 hover:text-[#00d2ff]"
              }`}
            >
              {t.nav.spaces}
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className={`transition ${
                  pathname.startsWith("/dashboard")
                    ? "text-[#00d2ff] font-semibold"
                    : "text-zinc-300 hover:text-[#00d2ff]"
                }`}
              >
                {t.nav.myBookings}
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg bg-blue-950/70 border border-blue-500/40 px-3 py-1.5 text-xs font-bold text-[#00d2ff] hover:bg-blue-600 hover:text-white transition shadow-2xs"
              >
                <span>← Panel Admin</span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle darkSurface />
            <LanguageSwitcher darkSurface />
          </div>

          <div className="flex items-center gap-3">
            {!loading && user ? (
              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-xs font-semibold text-zinc-300">
                  {user.name.split(" ")[0]}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-950/40 px-3.5 py-2 text-xs font-semibold text-red-400 hover:bg-red-900/60 active:scale-95 transition cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{t.nav.logout}</span>
                </button>
              </div>
            ) : !loading ? (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-300 hover:text-[#00d2ff] px-3 py-1.5 transition"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-gradient-to-r from-[#183ebc] to-[#00d2ff] hover:brightness-110 px-4 py-2 text-sm font-medium text-white shadow-xs transition"
                >
                  {t.nav.register}
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
}
