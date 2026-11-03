import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/ui";
import { ArrowRight, PhoneIcon, ServiceGlyph } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, ServiceMap } from "@/components/sections/InfoSections";
import { getDictionary } from "@/content/dictionary";
import { cities, countyName, getCity } from "@/content/cities";
import { services } from "@/content/services";
import { hasLocale, localePath, type Locale } from "@/lib/i18n";
import { businessId, pageMetadata } from "@/lib/seo";
import { site, telHref } from "@/lib/site";

export async function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

function cityTitle(lang: Locale, name: string) {
  return lang === "en"
    ? `Concrete, Epoxy & Construction Services in ${name}, WA`
    : `Servicios de concreto, epoxy y construcción en ${name}, WA`;
}

export async function generateMetadata({ params }: PageProps<"/[lang]/service-areas/[city]">): Promise<Metadata> {
  const { lang, city } = await params;
  const c = getCity(city);
  if (!hasLocale(lang) || !c) return {};
  const description =
    lang === "en"
      ? `ECG Construction serves ${c.name}, ${c.county}, WA: concrete driveways and patios, polished concrete, epoxy floors, asphalt, excavation, pressure washing and property maintenance. Call ${site.phoneDisplay}.`
      : `ECG Construction atiende ${c.name}, ${countyName(c.county, "es")}, WA: entradas y patios de concreto, concreto pulido, pisos epóxicos, asfalto, excavación, lavado a presión y mantenimiento. Llama al ${site.phoneDisplay}.`;
  return pageMetadata({ lang, path: `/service-areas/${c.slug}`, title: cityTitle(lang, c.name), description });
}

export default async function CityPage({ params }: PageProps<"/[lang]/service-areas/[city]">) {
  const { lang, city } = await params;
  const c = getCity(city);
  if (!hasLocale(lang) || !c) notFound();
  const t = getDictionary(lang);
  const county = countyName(c.county, lang);
  const nearby = c.nearby.map(getCity).filter((x) => x !== undefined);

  const intro =
    lang === "en"
      ? `ECG Construction LLC provides concrete construction, concrete polishing, epoxy floor coatings, asphalt, excavation, pressure washing and property maintenance in ${c.name}, ${county}, Washington. We are licensed, bonded and insured, with more than 20 years of hands-on experience.`
      : `ECG Construction LLC ofrece construcción en concreto, pulido de concreto, recubrimientos epóxicos, asfalto, excavación, lavado a presión y mantenimiento de propiedades en ${c.name}, ${county}, Washington. Contamos con licencia, fianza y seguro, y más de 20 años de experiencia práctica.`;

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: cityTitle(lang, c.name),
    provider: { "@id": businessId },
    areaServed: {
      "@type": "City",
      name: `${c.name}, WA`,
      containedInPlace: { "@type": "AdministrativeArea", name: `${c.county}, Washington` },
    },
    serviceType: services.map((s) => s.name.en),
  };

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: t.nav.areas, path: localePath("/service-areas", lang) },
          { name: c.name, path: localePath(`/service-areas/${c.slug}`, lang) },
        ]}
        eyebrow={`${c.name} · ${county}, WA`}
        title={cityTitle(lang, c.name)}
        lead={intro}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={localePath("/contact", lang)} className="btn btn-primary">
            {t.common.requestEstimate}
          </Link>
          <a href={telHref} className="btn btn-outline">
            <PhoneIcon className="h-4 w-4" /> {site.phoneDisplay}
          </a>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p data-reveal className="text-lg leading-relaxed text-neutral-300">
              {c.note[lang]}
            </p>
            <h2 className="mt-10 mb-5 text-2xl font-bold">
              {t.common.servicesIn} {c.name}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2" data-reveal-stagger="60">
              {services.map((s) => (
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
            {nearby.length > 0 && (
              <>
                <h2 className="mt-10 mb-4 text-xl font-bold">{t.common.nearby}</h2>
                <ul className="flex flex-wrap gap-2">
                  {nearby.map((n) => (
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
            <ServiceMap title={`${t.area.mapTitle} — ${c.name}`} query={`${c.name}, WA`} />
          </div>
        </div>
      </Section>
      <JsonLd data={placeJsonLd} />
      <CtaBand lang={lang} />
    </>
  );
}
