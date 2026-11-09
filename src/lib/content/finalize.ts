import type { Locale } from "@/lib/i18n";
import type { SiteContent } from "./types";

/**
 * Pasos comunes al contenido (venga de Sanity o del respaldo estático):
 *  1. Los textos de horario y área de la "Configuración general" reemplazan a los del diccionario.
 *  2. Las variables {phone}, {email}, {license} y {years} se sustituyen por los datos actuales,
 *     así un cambio de teléfono o registro en Sanity se refleja en todos los textos.
 */
export function finalizeContent(content: SiteContent): SiteContent {
  const s = content.settings;
  const tokens: Record<string, string> = {
    phone: s.phoneDisplay,
    email: s.email,
    license: s.contractorLicense,
    years: String(s.yearsExperience),
  };
  const fill = <T>(value: T): T => deepMap(value, (text) => text.replace(/\{(phone|email|license|years)\}/g, (_, k) => tokens[k]));

  const dict = { ...content.dict };
  for (const lang of Object.keys(dict) as Locale[]) {
    const d = dict[lang];
    dict[lang] = fill({
      ...d,
      common: {
        ...d.common,
        hoursValue: s.hoursText[lang] || d.common.hoursValue,
        hoursShort: s.hoursShort[lang] || d.common.hoursShort,
        weekend: s.weekendText[lang] || d.common.weekend,
        serviceAreaValue: s.serviceAreaText[lang] || d.common.serviceAreaValue,
      },
    });
  }

  return {
    ...content,
    dict,
    services: fill(content.services),
    faqs: fill(content.faqs),
    privacy: fill(content.privacy),
  };
}

/** Recorre objetos/arrays y transforma cada string (sin tocar imágenes ni números). */
function deepMap<T>(value: T, fn: (s: string) => string): T {
  if (typeof value === "string") return fn(value) as T;
  if (Array.isArray(value)) return value.map((v) => deepMap(v, fn)) as T;
  if (value && typeof value === "object") {
    // Las imágenes (src/width/height) no se modifican.
    if ("src" in value && "width" in value) return value;
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deepMap(v, fn)])) as T;
  }
  return value;
}
