import { createImageUrlBuilder } from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";
import { sanityClient } from "@/sanity/client";
import { HOME_GROUPS, TUPLES, UI_GROUPS } from "@/sanity/dictionary-map";
import { dictionaries, type Dictionary } from "@/content/dictionary";
import { locales, type L, type LList, type Locale } from "@/lib/i18n";
import { staticContent } from "./static";
import type { City, County, Faq, Img, PrivacyContent, Project, ProjectCategory, Service, ServiceIcon, SiteContent } from "./types";

/* ------------------------------------------------------------------ */
/* Consulta                                                            */
/* ------------------------------------------------------------------ */

const IMAGE = `{ hotspot, crop, asset->{ _id, metadata { lqip, dimensions { width, height } } } }`;

export const SITE_QUERY = /* groq */ `{
  "settings": *[_id == "siteSettings"][0]{
    ..., "logo": logo${IMAGE}, "logoSquare": logoSquare${IMAGE}, "ogImage": ogImage${IMAGE}
  },
  "home": *[_id == "homePage"][0]{ ..., "heroImage": heroImage${IMAGE}, "aboutImage": aboutImage${IMAGE} },
  "ui": *[_id == "uiTexts"][0],
  "privacy": *[_id == "privacyPolicy"][0],
  "services": *[_type == "service" && defined(slug.current)] | order(order asc) {
    ..., "slug": slug.current, "image": image${IMAGE}, "related": related[]->slug.current
  },
  "counties": *[_type == "county" && defined(slug.current)] | order(order asc) { ..., "slug": slug.current },
  "cities": *[_type == "city" && defined(slug.current)] | order(order asc) {
    ..., "slug": slug.current, "county": county->slug.current, "nearby": nearby[]->slug.current
  },
  "projects": *[_type == "project"] | order(order asc) {
    _id, category, alt, "image": image${IMAGE}, "video": video.asset->{ url, mimeType }
  },
  "faqs": *[_type == "faq"] | order(order asc) { question, answer }
}`;

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

// Los datos de Sanity llegan sin tipos estrictos: se validan campo por campo al convertir.
/* eslint-disable @typescript-eslint/no-explicit-any */
type Raw = any;

const FALLBACK_BLUR = "data:image/gif;base64,R0lGODlhAQABAIAAACMiIwAAACwAAAAAAQABAAACAkQBADs=";

const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

/** Imagen de Sanity → imagen para next/image (CDN de Sanity, formato automático, máx. 1600 px). */
function toImg(raw: Raw, maxWidth = 1600): Img | null {
  const dims = raw?.asset?.metadata?.dimensions;
  if (!builder || !raw?.asset?._id || !dims) return null;
  const width = Math.min(maxWidth, dims.width);
  const height = Math.round((dims.height / dims.width) * width);
  return {
    src: builder.image(raw).width(width).auto("format").quality(80).url(),
    width,
    height,
    // Vista previa borrosa generada por Sanity (o un color oscuro si no existe).
    blurDataURL: raw.asset.metadata.lqip || FALLBACK_BLUR,
  };
}

/** { en, es } de Sanity → L. Si falta el español se usa el inglés. */
function loc(raw: Raw, fallback?: L): L {
  const en = typeof raw?.en === "string" && raw.en ? raw.en : (fallback?.en ?? "");
  const es = typeof raw?.es === "string" && raw.es ? raw.es : en || (fallback?.es ?? "");
  return { en, es };
}

function locList(raw: Raw, fallback?: LList): LList {
  const en: string[] = Array.isArray(raw?.en) && raw.en.length ? raw.en : (fallback?.en ?? []);
  const es: string[] = Array.isArray(raw?.es) && raw.es.length ? raw.es : en;
  return { en, es };
}

/* ------------------------------------------------------------------ */
/* Diccionario: documentos "Página de inicio" + "Textos generales"     */
/* ------------------------------------------------------------------ */

function buildDictionaries(home: Raw, ui: Raw): Record<Locale, Dictionary> {
  const out = {} as Record<Locale, Dictionary>;
  for (const lang of locales) {
    const base = dictionaries[lang] as unknown as Record<string, Record<string, unknown>>;
    const dict: Record<string, Record<string, unknown>> = {};
    for (const group of Object.keys(base)) {
      const doc = (HOME_GROUPS as readonly string[]).includes(group) ? home : (UI_GROUPS as readonly string[]).includes(group) ? ui : null;
      const src = doc?.[group] ?? {};
      dict[group] = {};
      for (const [key, fallback] of Object.entries(base[group])) {
        const value = src[key];
        const tuple = TUPLES[`${group}.${key}`];
        if (typeof fallback === "string") {
          dict[group][key] = (value?.[lang] as string) || (value?.en as string) || fallback;
        } else if (tuple && Array.isArray(value) && value.length) {
          const [a, b] = tuple;
          dict[group][key] = value.map((item: Raw) => [item?.[a]?.[lang] || item?.[a]?.en || "", item?.[b]?.[lang] || item?.[b]?.en || ""]);
        } else if (!tuple && Array.isArray(fallback)) {
          const list = Array.isArray(value?.[lang]) && value[lang].length ? value[lang] : value?.en;
          dict[group][key] = Array.isArray(list) && list.length ? list : fallback;
        } else {
          dict[group][key] = fallback;
        }
      }
    }
    out[lang] = dict as unknown as Dictionary;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Conversión completa                                                 */
/* ------------------------------------------------------------------ */

/**
 * Lee todo el contenido de Sanity. Si algún documento todavía no existe (p. ej. antes de
 * crearlo en el Studio), esa parte usa el respaldo estático para que la web no se rompa.
 */
export async function sanityContent(): Promise<SiteContent> {
  if (!sanityClient) return staticContent();
  // Sin caché de fetch: la caché la maneja getContent() ("use cache" + webhook), así un build nuevo
  // nunca reutiliza contenido viejo guardado en .next/cache.
  const data: Raw = await sanityClient.fetch(SITE_QUERY, {}, { cache: "no-store" });
  return mapSanityData(data);
}

/** Convierte el resultado de SITE_QUERY al contenido de la web (exportado para pruebas). */
export function mapSanityData(data: Raw): SiteContent {
  const fb = staticContent();

  const st = data?.settings;
  const settings: SiteContent["settings"] = st
    ? {
        legalName: st.legalName || fb.settings.legalName,
        name: st.name || fb.settings.name,
        slogan: st.slogan ?? "",
        tagline: st.tagline ?? "",
        contactName: st.contactName ?? "",
        phoneDisplay: st.phoneDisplay || fb.settings.phoneDisplay,
        phoneE164: st.phoneE164 || fb.settings.phoneE164,
        email: st.email || fb.settings.email,
        contractorLicense: st.contractorLicense || fb.settings.contractorLicense,
        yearsExperience: typeof st.yearsExperience === "number" ? st.yearsExperience : fb.settings.yearsExperience,
        hours: {
          days: Array.isArray(st.hours?.days) && st.hours.days.length ? st.hours.days : fb.settings.hours.days,
          opens: st.hours?.opens || fb.settings.hours.opens,
          closes: st.hours?.closes || fb.settings.hours.closes,
        },
        hoursText: loc(st.hoursText, fb.settings.hoursText),
        hoursShort: loc(st.hoursShort, fb.settings.hoursShort),
        weekendText: loc(st.weekendText, fb.settings.weekendText),
        serviceAreaText: loc(st.serviceAreaText, fb.settings.serviceAreaText),
        mapQuery: st.mapQuery || fb.settings.mapQuery,
        logo: toImg(st.logo, 800),
        logoSquare: toImg(st.logoSquare, 600),
        ogImage: toImg(st.ogImage, 1200),
        social: Array.isArray(st.social) ? st.social.filter((x: Raw) => x?.platform && x?.url) : [],
      }
    : fb.settings;

  const services: Service[] = Array.isArray(data?.services) && data.services.length
    ? data.services.map(
        (s: Raw): Service => ({
          slug: s.slug,
          icon: (s.icon as ServiceIcon) || "concrete",
          image: toImg(s.image) ?? fb.images.hero,
          imageAlt: loc(s.imageAlt),
          name: loc(s.name),
          featured: s.featured?.en ? loc(s.featured) : undefined,
          short: loc(s.short),
          intro: loc(s.intro),
          items: locList(s.items),
          gallery: (s.gallery as ProjectCategory) || undefined,
          faqs: (s.faqs ?? []).map((f: Raw): Faq => ({ q: loc(f.q), a: loc(f.a) })),
          related: (s.related ?? []).filter(Boolean),
        }),
      )
    : fb.services;

  const counties: County[] = Array.isArray(data?.counties) && data.counties.length
    ? data.counties.map((c: Raw): County => ({
        slug: c.slug,
        name: loc(c.name),
        schemaName: c.schemaName ?? c.name?.en ?? "",
        mapQuery: c.mapQuery ?? `${c.name?.en}, WA`,
        note: loc(c.note),
      }))
    : fb.counties;

  const cities: City[] = Array.isArray(data?.cities) && data.cities.length
    ? data.cities.map((c: Raw): City => ({
        slug: c.slug,
        name: c.name,
        county: c.county ?? counties[0]?.slug,
        nearby: (c.nearby ?? []).filter(Boolean),
        note: loc(c.note),
      }))
    : fb.cities;

  const projects: Project[] = Array.isArray(data?.projects) && data.projects.length
    ? data.projects
        .map((p: Raw): Project | null => {
          const image = toImg(p.image);
          if (!image) return null;
          return {
            id: p._id,
            category: p.category as ProjectCategory,
            image,
            alt: loc(p.alt),
            video: p.video?.url ? { url: p.video.url, mimeType: p.video.mimeType || "video/mp4" } : undefined,
          };
        })
        .filter((p: Project | null): p is Project => p !== null)
    : fb.projects;

  const faqs: Faq[] = Array.isArray(data?.faqs) && data.faqs.length
    ? data.faqs.map((f: Raw): Faq => ({ q: loc(f.question), a: loc(f.answer) }))
    : fb.faqs;

  // Política: el cuerpo viene del editor WYSIWYG (Portable Text). Sin español, se usa el inglés.
  const pv = data?.privacy;
  const privacy =
    pv && Array.isArray(pv.body?.en) && pv.body.en.length
      ? (Object.fromEntries(
          locales.map((lang) => [
            lang,
            {
              title: loc(pv.title, { en: fb.privacy.en.title, es: fb.privacy.es.title })[lang],
              description: loc(pv.description)[lang],
              updated: loc(pv.updated)[lang],
              body: Array.isArray(pv.body?.[lang]) && pv.body[lang].length ? pv.body[lang] : pv.body.en,
            } satisfies PrivacyContent,
          ]),
        ) as Record<Locale, PrivacyContent>)
      : fb.privacy;

  return {
    source: "sanity",
    settings,
    dict: data?.home || data?.ui ? buildDictionaries(data.home, data.ui) : fb.dict,
    images: {
      hero: toImg(data?.home?.heroImage) ?? fb.images.hero,
      about: toImg(data?.home?.aboutImage) ?? fb.images.about,
    },
    services,
    counties,
    cities,
    projects,
    faqs,
    privacy,
  };
}
