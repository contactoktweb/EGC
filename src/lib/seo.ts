import type { Metadata } from "next";
import { site } from "./site";
import { localePath, locales, ogLocale, type Locale } from "./i18n";
import { services } from "@/content/services";
import { cities, counties } from "@/content/cities";
import type { Faq } from "@/content/services";

const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630 };

type PageMetaInput = {
  lang: Locale;
  /** Ruta sin prefijo de idioma, p. ej. "/services". */
  path: string;
  title: string;
  description: string;
  /** Si es true, el título no usa la plantilla "%s | ECG Construction LLC". */
  absoluteTitle?: boolean;
};

export function pageMetadata({ lang, path, title, description, absoluteTitle }: PageMetaInput): Metadata {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l === "en" ? "en-US" : "es-US"] = localePath(path, l);
  languages["x-default"] = localePath(path, "en");

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: localePath(path, lang),
      languages,
    },
    openGraph: {
      type: "website",
      siteName: site.legalName,
      title,
      description,
      url: localePath(path, lang),
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ ...OG_IMAGE, alt: site.legalName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD (schema.org)                                                */
/* ------------------------------------------------------------------ */

export const businessId = `${site.url}/#business`;
const abs = (path: string) => `${site.url}${path}`;

export function businessJsonLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "HomeAndConstructionBusiness"],
    "@id": businessId,
    name: site.legalName,
    alternateName: site.name,
    slogan: site.slogan,
    description:
      lang === "en"
        ? "Licensed Washington general contractor (WA Contractor Reg # ECGCOCL749K2) with 20+ years of experience in concrete, polished concrete, epoxy floor coatings, asphalt, excavation, pressure washing and property maintenance in Snohomish County, Skagit County and North King County, Washington."
        : "Contratista general con licencia en Washington (registro WA # ECGCOCL749K2) con más de 20 años de experiencia en concreto, concreto pulido, recubrimientos epóxicos, asfalto, excavación, lavado a presión y mantenimiento de propiedades en los condados de Snohomish y Skagit y el norte del condado de King, Washington.",
    url: abs(localePath("/", lang)),
    logo: abs("/logo-ecg-construction.png"),
    image: abs(OG_IMAGE.url),
    telephone: site.phoneE164,
    email: site.email,
    inLanguage: ["en-US", "es-US"],
    knowsLanguage: ["en", "es"],
    address: {
      "@type": "PostalAddress",
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: [
      ...counties.map((c) => ({ "@type": "AdministrativeArea", name: c.schemaName })),
      ...cities.map((c) => ({ "@type": "City", name: `${c.name}, ${site.region}` })),
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days.map((d) => `https://schema.org/${d}`),
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      name: site.contactName,
      telephone: site.phoneE164,
      email: site.email,
      availableLanguage: ["English", "Spanish"],
      areaServed: "US-WA",
    },
    knowsAbout: services.map((s) => s.name.en),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: lang === "en" ? "Construction services" : "Servicios de construcción",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name[lang],
          url: abs(localePath(`/services/${s.slug}`, lang)),
        },
      })),
    },
    ...(site.contractorLicense
      ? {
          hasCredential: {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: `Washington State Contractor License ${site.contractorLicense}`,
          },
        }
      : {}),
  };
}

export function websiteJsonLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.legalName,
    url: abs(localePath("/", lang)),
    inLanguage: lang === "en" ? "en-US" : "es-US",
    publisher: { "@id": businessId },
  };
}

export function serviceJsonLd(lang: Locale, slug: string) {
  const s = services.find((x) => x.slug === slug);
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
    areaServed: counties.map((c) => ({ "@type": "AdministrativeArea", name: c.schemaName })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: s.name[lang],
      itemListElement: s.items[lang].map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item },
      })),
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
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}
