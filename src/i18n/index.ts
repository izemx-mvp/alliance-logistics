/**
 * Lightweight i18n for FR (default) / EN.
 *
 * The active language lives in the URL as `?lang=en` (absent = French), so that
 * every page has a crawlable EN variant (hreflang) and SSR renders the right
 * language. The root route retains `lang` across navigation, and the choice is
 * also persisted in localStorage (restored on the next visit).
 */
import { useCallback } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { en } from "./en";
import { fr, type Dictionary } from "./fr";

export type Lang = "fr" | "en";
export const LANGS: readonly Lang[] = ["fr", "en"];
export const LANG_STORAGE_KEY = "alliance-lang";

/** A value available in both languages. */
export type Localized<T = string> = Record<Lang, T>;

export const dictionaries: Record<Lang, Dictionary> = { fr, en };

export type LangSearch = { lang?: "en" | undefined };

/** Root search validator: only `lang=en` is meaningful, anything else means French. */
export function validateLangSearch(search: Record<string, unknown>): LangSearch {
  return search["lang"] === "en" ? { lang: "en" } : {};
}

export function langFromSearch(search: unknown): Lang {
  if (search && typeof search === "object" && "lang" in search) {
    return (search as { lang?: unknown }).lang === "en" ? "en" : "fr";
  }
  return "fr";
}

export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang];
}

/** Current language, read from the URL. */
export function useLang(): Lang {
  return useRouterState({ select: (s) => langFromSearch(s.location.search) });
}

/** Current dictionary. */
export function useT(): Dictionary {
  return dictionaries[useLang()];
}

/** Switch language while staying on the current page (and persist the choice). */
export function useSetLang() {
  const navigate = useNavigate();
  return useCallback(
    (lang: Lang) => {
      try {
        window.localStorage.setItem(LANG_STORAGE_KEY, lang);
      } catch {
        /* storage unavailable (private mode): the URL still carries the choice */
      }
      void navigate({
        to: ".",
        search: (prev: Record<string, unknown>) => ({
          ...prev,
          lang: lang === "en" ? ("en" as const) : undefined,
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );
}

/** Locale code for Intl formatting. */
export function intlLocale(lang: Lang): string {
  return lang === "en" ? "en-GB" : "fr-FR";
}
