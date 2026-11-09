import { cacheLife, cacheTag } from "next/cache";
import { isSanityConfigured } from "@/sanity/env";
import type { Locale } from "@/lib/i18n";
import { finalizeContent } from "./finalize";
import { sanityContent } from "./sanity";
import { staticContent } from "./static";
import type { SiteContent } from "./types";

export type * from "./types";

/** Etiqueta de caché: el webhook de Sanity (/api/revalidate) la invalida al publicar. */
export const CONTENT_TAG = "sanity";

/**
 * Todo el contenido de la web.
 * - Con claves de Sanity: se lee de Sanity (cacheado; se actualiza al publicar o cada hora).
 * - Sin claves: respaldo estático de src/content.
 */
export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const raw = isSanityConfigured ? await sanityContent() : staticContent();
  return finalizeContent(raw);
}

/** Contenido + textos del idioma pedido. */
export async function getPageContent(lang: Locale) {
  const content = await getContent();
  return { ...content, t: content.dict[lang] };
}
