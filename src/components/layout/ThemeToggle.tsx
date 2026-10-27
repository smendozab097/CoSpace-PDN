"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  variant?: "button" | "pressable" | "switch";
  darkSurface?: boolean;
}

const emptySubscribe = () => () => {};

function subscribeTheme(callback: () => void) {
  window.addEventListener("cospace-theme-change", callback);
  window.addEventListener("storage", callback);

  const observer = new MutationObserver(() => callback());
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  return () => {
    window.removeEventListener("cospace-theme-change", callback);
    window.removeEventListener("storage", callback);
    observer.disconnect();
  };
}

function getThemeSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot(): boolean {
  return false;
}

export function ThemeToggle({
  className = "",
  darkSurface = false,
}: ThemeToggleProps) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot
  );

  const toggleTheme = () => {
    const nextDark = !isDark;

    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    window.dispatchEvent(
      new CustomEvent("cospace-theme-change", { detail: { dark: nextDark } })
    );
  };

  if (!isHydrated) {
    return (
      <div
        className={`h-9 w-9 rounded-xl border ${
          darkSurface
            ? "border-white/10 bg-white/5"
            : "border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-white/5"
        } opacity-60 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={`group relative inline-flex h-9 w-9 items-center justify-center rounded-xl border ${
        darkSurface
          ? "border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:border-white/20 active:bg-white/15"
          : "border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-white/5 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/10 hover:border-zinc-300 dark:hover:border-white/20 active:bg-zinc-200/80 dark:active:bg-white/15"
      } active:scale-90 transition-all duration-150 shadow-2xs cursor-pointer backdrop-blur-sm select-none ${className}`}
    >
      {isDark ? (
        <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform duration-200 group-hover:rotate-45 drop-shadow-[0_0_6px_rgba(251,191,36,0.35)]" />
      ) : (
        <Moon
          className={`h-4.5 w-4.5 ${
            darkSurface
              ? "text-[#00d2ff] drop-shadow-[0_0_6px_rgba(0,210,255,0.35)]"
              : "text-indigo-600"
          } transition-transform duration-200 group-hover:-rotate-12`}
        />
      )}
    </button>
  );
}
