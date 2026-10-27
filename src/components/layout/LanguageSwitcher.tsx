"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
  darkSurface?: boolean;
}

export function LanguageSwitcher({
  className = "",
  compact = false,
  darkSurface = false,
}: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  const toggleLocale = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  const nextLocale = locale === "es" ? "en" : "es";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={
        locale === "es" ? "Cambiar idioma a inglés" : "Switch language to Spanish"
      }
      title={
        locale === "es"
          ? "Cambiar idioma a inglés (EN)"
          : "Switch language to Spanish (ES)"
      }
      className={`group relative inline-flex h-9 items-center gap-1.5 ${
        compact ? "px-2" : "px-2.5"
      } rounded-xl border ${
        darkSurface
          ? "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:border-white/20 active:bg-white/15"
          : "border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/20 active:bg-zinc-200/80 dark:active:bg-white/15"
      } active:scale-92 text-xs font-semibold shadow-2xs transition-all duration-150 cursor-pointer backdrop-blur-sm select-none ${className}`}
    >
      <Languages
        className={`h-3.5 w-3.5 ${
          darkSurface ? "text-[#00d2ff]" : "text-blue-600 dark:text-[#00d2ff]"
        } transition-transform duration-200 group-hover:scale-110`}
      />
      <span className="font-bold tracking-wider">{locale.toUpperCase()}</span>
      {!compact && (
        <span
          className={`text-[10px] ${
            darkSurface
              ? "text-zinc-400 border-white/15"
              : "text-zinc-400 dark:text-zinc-500 border-zinc-200 dark:border-zinc-700"
          } font-normal border-l pl-1.5`}
        >
          {nextLocale.toUpperCase()}
        </span>
      )}
    </button>
  );
}
