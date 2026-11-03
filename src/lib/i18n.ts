export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

/** Texto localizado. */
export type L = Record<Locale, string>;
export type LList = Record<Locale, string[]>;

export const ogLocale: Record<Locale, string> = { en: "en_US", es: "es_US" };
export const htmlLang: Record<Locale, string> = { en: "en-US", es: "es-US" };

/** Construye una ruta localizada: path("/services", "es") => "/es/services" */
export function localePath(path: string, lang: Locale): string {
  const clean = path === "/" ? "" : path;
  return `/${lang}${clean}`;
}
