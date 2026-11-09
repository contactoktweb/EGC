import type { Metadata } from "next";
import { site } from "./site";
import { localePath, locales, ogLocale, type Locale } from "./i18n";
import { getContent } from "./content";
import type { Faq, SiteContent } from "./content/types";

const abs = (path: string) => (path.startsWith("http") ? path : `${site.url}${path}`);
export const businessId = `${site.url}/#business`;

type PageMetaInput = {
  lang: Locale;
  /** Ruta sin prefijo de idioma, p. ej. "/services". */
  path: string;
  title: string;
  description: string;
  /** Si es true, el título no usa la plantilla "%s | ECG Construction LLC". */
  absoluteTitle?: boolean;
};

/** Metadata por página: canonical, hreflang, Open Graph (imagen de "Configuración general"). */
export async function pageMetadata({ lang, path, title, description, absoluteTitle }: PageMetaInput): Promise<Metadata> {
  const { settings } = await getContent();
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l === "en" ? "en-US" : "es-US"] = localePath(path, l);
  languages["x-default"] = localePath(path, "en");
  const og = settings.ogImage;
  const images = og ? [{ url: og.src, width: og.width, height: og.height, alt: settings.legalName }] : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: localePath(path, lang), languages },
    openGraph: {
      type: "website",
      siteName: settings.legalName,
      title,
      description,
      url: localePath(path, lang),
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images,
    },
    twitter: { card: "summary_large_image", title, description, images: og ? [og.src] : undefined },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD (schema.org)                                                */
/* ------------------------------------------------------------------ */

export function businessJsonLd(c: SiteContent, lang: Locale) {
  const s = c.settings;
  return {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
    "@id": businessId,
    name: s.legalName,
    alternateName: s.name,
    slogan: s.slogan || undefined,
    description: c.dict[lang].pages.homeDescription,
    url: abs(localePath("/", lang)),
    logo: s.logoSquare ? abs(s.logoSquare.src) : undefined,
    image: s.ogImage ? abs(s.ogImage.src) : undefined,
    telephone: s.phoneE164,
    email: s.email,
    knowsLanguage: ["en", "es"],
    address: { "@type": "PostalAddress", addressRegion: "WA", addressCountry: "US" },
    areaServed: [
      ...c.counties.map((county) => ({ "@type": "AdministrativeArea", name: county.schemaName })),
      ...c.cities.map((city) => ({ "@type": "City", name: `${city.name}, WA` })),
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: s.hours.days.map((d) => `https://schema.org/${d}`),
        opens: s.hours.opens,
        closes: s.hours.closes,
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      name: s.contactName || undefined,
      telephone: s.phoneE164,
      email: s.email,
      availableLanguage: ["English", "Spanish"],
      areaServed: "US-WA",
    },
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: `Washington State Contractor Registration ${s.contractorLicense}`,
    },
    sameAs: s.social.length ? s.social.map((x) => x.url) : undefined,
    knowsAbout: c.services.map((x) => x.name.en),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: lang === "en" ? "Construction services" : "Servicios de construcción",
      itemListElement: c.services.map((x) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: x.name[lang], url: abs(localePath(`/services/${x.slug}`, lang)) },
      })),
    },
  };
}

export function websiteJsonLd(c: SiteContent, lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: c.settings.legalName,
    url: abs(localePath("/", lang)),
    inLanguage: lang === "en" ? "en-US" : "es-US",
    publisher: { "@id": businessId },
  };
}

export function serviceJsonLd(c: SiteContent, lang: Locale, slug: string) {
  const s = c.services.find((x) => x.slug === slug);
  if (!s) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name[lang],
    serviceType: s.name.en,
    description: s.intro[lang],
    url: abs(localePath(`/services/${s.slug}`, lang)),
    image: abs(s.image.src),
    provider: { "@id": businessId },
    areaServed: c.counties.map((county) => ({ "@type": "AdministrativeArea", name: county.schemaName })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: s.name[lang],
      itemListElement: s.items[lang].map((item) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: item } })),
    },
  };
}

export function faqJsonLd(lang: Locale, faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q[lang],
      acceptedAnswer: { "@type": "Answer", text: f.a[lang] },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: abs(item.path) })),
  };
}
