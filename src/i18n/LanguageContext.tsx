"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import es from "./messages/es.json";
import en from "./messages/en.json";

export type Locale = "es" | "en";
export type TranslationSchema = typeof es;

interface LanguageContextType {
  locale: Locale;
  setLocale: (lang: Locale) => void;
  t: TranslationSchema;
}

const translations: Record<Locale, TranslationSchema> = { es, en };

function subscribeLanguage(callback: () => void) {
  window.addEventListener("cospace-lang-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("cospace-lang-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getLanguageSnapshot(): Locale {
  const saved = localStorage.getItem("cospace_lang");
  if (saved === "es" || saved === "en") {
    return saved;
  }
  return "es";
}

function getServerSnapshot(): Locale {
  return "es";
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "es",
  setLocale: () => {},
  t: es,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getServerSnapshot
  );

  const setLocale = (lang: Locale) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cospace_lang", lang);
      document.documentElement.lang = lang;
      window.dispatchEvent(
        new CustomEvent("cospace-lang-change", { detail: { locale: lang } })
      );
    }
  };

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t: translations[locale] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
