import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/ui";
import { ArrowRight, PhoneIcon, ServiceGlyph } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, ServiceMap } from "@/components/sections/InfoSections";
import { getContent, getPageContent } from "@/lib/content";
import { citiesIn, countyLabel, findCity, findCounty, telHref } from "@/lib/content/helpers";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import type { SiteContent } from "@/lib/content/types";
import { businessId, pageMetadata } from "@/lib/seo";

/** Una página por ciudad y una por condado (/service-areas/skagit, /service-areas/everett…). */
export async function generateStaticParams() {
  const { counties, cities } = await getContent();
  return [...counties.map((c) => ({ city: c.slug })), ...cities.map((c) => ({ city: c.slug }))];
}

type AreaView = {
  slug: string;
  name: string;
  /** Nombre dentro de una frase ("Skagit County" / "el condado de Skagit"). */
  inName: string;
  /** "Everett, Snohomish County" o "Skagit County". */
  place: string;
  note: string;
  links: { slug: string; name: string }[];
  linksTitle: string;
  mapQuery: string;
  schemaArea: object;
};

function resolveArea(content: SiteContent, slug: string, lang: Locale): AreaView | null {
  const t = content.dict[lang];
  const { counties, cities } = content;
  const countyName = (key: string, l: Locale) => countyLabel(counties, key, l);
  const getCity = (x: string) => findCity(cities, x);
  const county = findCounty(counties, slug);
  if (county) {
    return {
      slug,
      name: county.name[lang],
      inName: lang === "en" ? county.name.en : `el ${countyName(county.slug, "es")}`,
      place: lang === "en" ? county.name.en : `el ${countyName(county.slug, "es")}`,
      note: county.note[lang],
      links: citiesIn(cities, county.slug).map((c) => ({ slug: c.slug, name: c.name })),
      linksTitle: lang === "en" ? `Cities we serve in ${county.name.en}` : `Ciudades que atendemos en el ${countyName(county.slug, "es")}`,
      mapQuery: county.mapQuery,
      schemaArea: { "@type": "AdministrativeArea", name: county.schemaName },
    };
  }
  const city = getCity(slug);
  if (!city) return null;
  const cName = countyName(city.county, lang);
  return {
    slug,
    name: city.name,
    inName: city.name,
    place: `${city.name}, ${cName}`,
    note: city.note[lang],
    links: city.nearby
      .map((x) => getCity(x))
      .filter((x) => x !== undefined)
      .map((n) => ({ slug: n.slug, name: n.name })),
    linksTitle: t.common.nearby,
    mapQuery: `${city.name}, WA`,
    schemaArea: {
      "@type": "City",
      name: `${city.name}, WA`,
      containedInPlace: { "@type": "AdministrativeArea", name: findCounty(counties, city.county)?.schemaName },
    },
  };
}

function areaTitle(lang: Locale, name: string) {
  return lang === "en"
    ? `Concrete, Epoxy & Construction Services in ${name}, WA`
    : `Servicios de concreto, epoxy y construcción en ${name}, WA`;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/service-areas/[city]">): Promise<Metadata> {
  const { lang, city } = await params;
  if (!hasLocale(lang)) return {};
  const content = await getContent();
  const { settings } = content;
  const a = resolveArea(content, city, lang);
  if (!a) return {};
  const description =
    lang === "en"
      ? `ECG Construction serves ${a.place}, WA: concrete driveways and patios, polished concrete, epoxy floors, asphalt, excavation, pressure washing and property maintenance. Call ${settings.phoneDisplay}.`
      : `ECG Construction atiende ${a.place}, WA: entradas y patios de concreto, concreto pulido, pisos epóxicos, asfalto, excavación, lavado a presión y mantenimiento. Llama al ${settings.phoneDisplay}.`;
  return pageMetadata({ lang, path: `/service-areas/${a.slug}`, title: areaTitle(lang, a.inName), description });
}

export default async function AreaPage({ params }: PageProps<"/[lang]/service-areas/[city]">) {
  const { lang, city } = await params;
  if (!hasLocale(lang)) notFound();
  const content = await getPageContent(lang);
  const { t, settings } = content;
  const a = resolveArea(content, city, lang);
  if (!a) notFound();

  const intro =
    lang === "en"
      ? `ECG Construction LLC provides concrete construction, concrete polishing, epoxy floor coatings, asphalt, excavation, pressure washing and property maintenance in ${a.place}, Washington. Licensed WA general contractor (Reg # ${settings.contractorLicense}) with more than ${settings.yearsExperience} years of hands-on experience.`
      : `ECG Construction LLC ofrece construcción en concreto, pulido de concreto, recubrimientos epóxicos, asfalto, excavación, lavado a presión y mantenimiento de propiedades en ${a.place}, Washington. Contratista general con licencia en WA (Reg # ${settings.contractorLicense}) y más de ${settings.yearsExperience} años de experiencia práctica.`;

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: areaTitle(lang, a.inName),
    provider: { "@id": businessId },
    areaServed: a.schemaArea,
    serviceType: content.services.map((s) => s.name.en),
  };

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: t.nav.areas, path: localePath("/service-areas", lang) },
          { name: a.name, path: localePath(`/service-areas/${a.slug}`, lang) },
        ]}
        eyebrow={`${a.name}, WA`}
        title={areaTitle(lang, a.inName)}
        lead={intro}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={localePath("/contact", lang)} className="btn btn-primary">
            {t.common.requestEstimate}
          </Link>
          <a href={telHref(settings)} className="btn btn-outline">
            <PhoneIcon className="h-4 w-4" /> {settings.phoneDisplay}
          </a>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p data-reveal className="text-lg leading-relaxed text-neutral-300">
              {a.note}
            </p>
            <h2 className="mt-10 mb-5 text-2xl font-bold">
              {t.common.servicesIn} {a.inName}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2" data-reveal-stagger="60">
              {content.services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={localePath(`/services/${s.slug}`, lang)}
                    className="card-lift flex h-full items-start gap-3 rounded border border-line bg-ink-2 p-4 hover:border-brand"
                  >
                    <ServiceGlyph icon={s.icon} className="h-6 w-6 shrink-0 text-brand-light" />
                    <span>
                      <span className="block font-semibold">{s.name[lang]}</span>
                      <span className="mt-1 block text-sm text-neutral-400">{s.short[lang]}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {a.links.length > 0 && (
              <>
                <h2 className="mt-10 mb-4 text-xl font-bold">{a.linksTitle}</h2>
                <ul className="flex flex-wrap gap-2">
                  {a.links.map((n) => (
                    <li key={n.slug}>
                      <Link
                        href={localePath(`/service-areas/${n.slug}`, lang)}
                        className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-sm hover:border-brand hover:text-brand-light"
                      >
                        {n.name} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div data-reveal="zoom" className="lg:sticky lg:top-28 lg:self-start">
            <ServiceMap title={`${t.area.mapTitle} — ${a.name}`} query={a.mapQuery} zoom={findCounty(content.counties, a.slug) ? 9 : 11} />
          </div>
        </div>
      </Section>
      <JsonLd data={placeJsonLd} />
      <CtaBand lang={lang} />
    </>
  );
}
