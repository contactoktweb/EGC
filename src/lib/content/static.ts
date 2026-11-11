import { dictionaries } from "@/content/dictionary";
import { serviceData } from "@/content/services";
import { projectData } from "@/content/projects";
import { cities, counties } from "@/content/cities";
import { generalFaqs } from "@/content/faqs";
import { privacy } from "@/content/privacy";
import { settingsData } from "@/content/settings";
import { staticImages } from "@/content/static-images";
import { homeImages } from "@/content/home";
import { privacyToBlocks } from "./portable";
import { locales } from "@/lib/i18n";
import type { Img, PrivacyContent, SiteContent } from "./types";
import type { Locale } from "@/lib/i18n";

/** Convierte un nombre de archivo de src/content/images en imagen para next/image. */
function img(file: string): Img {
  const i = staticImages[file];
  if (!i) throw new Error(`Imagen no encontrada en src/content/static-images.ts: ${file}`);
  return { src: i.src, width: i.width, height: i.height, blurDataURL: i.blurDataURL };
}

/** Contenido de respaldo, usado cuando Sanity todavía no está configurado. */
export function staticContent(): SiteContent {
  return {
    source: "static",
    settings: {
      ...settingsData,
      logo: settingsData.logo ? img(settingsData.logo) : null,
      logoSquare: settingsData.logoSquare ? img(settingsData.logoSquare) : null,
      ogImage: settingsData.ogImage ? img(settingsData.ogImage) : null,
    },
    dict: dictionaries,
    images: {
      hero: img(homeImages.hero),
      about: img(homeImages.about),
    },
    services: serviceData.map((s) => ({ ...s, image: img(s.image) })),
    counties,
    cities,
    projects: projectData.map((p) => ({
      ...p,
      image: img(p.image),
      video: p.video ? { url: `/videos/${p.video}`, mimeType: p.video.endsWith(".webm") ? "video/webm" : "video/mp4" } : undefined,
    })),
    faqs: generalFaqs,
    // Sin reseñas de ejemplo: solo se muestran reseñas reales cargadas en Sanity.
    reviews: [],
    privacy: Object.fromEntries(
      locales.map((lang) => {
        const p = privacy[lang];
        return [lang, { title: p.title, description: p.description, updated: p.updated, body: privacyToBlocks(p, lang) }];
      }),
    ) as Record<Locale, PrivacyContent>,
  };
}
