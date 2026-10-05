"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { dictionaries, type Dictionary, type Locale } from "./dictionaries";

type Ctx = { locale: Locale; t: Dictionary; setLocale: (l: Locale) => void };

const LocaleContext = createContext<Ctx>({
  locale: "en",
  t: dictionaries.en as Dictionary,
  setLocale: () => {},
});

const STORAGE_KEY = "mky-locale";

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
let memoryLocale: Locale = "en"; // fallback when storage is blocked
const readLocale = (): Locale => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "pl" || saved === "en" ? saved : memoryLocale;
  } catch {
    return memoryLocale;
  }
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Server and first paint render English; the saved choice applies after hydration
  const locale = useSyncExternalStore(subscribe, readLocale, () => "en" as Locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    memoryLocale = l;
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable: memoryLocale keeps the choice for this visit */
    }
    listeners.forEach((cb) => cb());
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, t: dictionaries[locale] as Dictionary, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
