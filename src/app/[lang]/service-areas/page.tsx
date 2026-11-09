import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/ui";
import { ArrowRight, PinIcon } from "@/components/Icons";
import { CtaBand, ServiceMap } from "@/components/sections/InfoSections";
import { getDictionary } from "@/content/dictionary";
import { citiesInCounty, counties } from "@/content/cities";
import { hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/service-areas">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/service-areas", title: t.pages.areasTitle, description: t.pages.areasDescription });
}

export default async function ServiceAreasPage({ params }: PageProps<"/[lang]/service-areas">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const groups = counties.map((county) => ({ county, items: citiesInCounty(county.slug) }));

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: t.nav.areas, path: localePath("/service-areas", lang) },
        ]}
        eyebrow={t.area.eyebrow}
        title={t.pages.areasTitle}
        lead={t.area.lead}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-10">
            {groups.map((g) => (
              <div key={g.county.slug}>
                <h2 className="mb-4 text-2xl font-bold">
                  <Link href={localePath(`/service-areas/${g.county.slug}`, lang)} className="hover:text-brand-light">
                    {g.county.name[lang]}
                  </Link>
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2" data-reveal-stagger="60">
                  {g.items.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={localePath(`/service-areas/${c.slug}`, lang)}
                        className="flex items-center gap-3 rounded border border-line bg-ink-2 px-4 py-3 hover:border-brand"
                      >
                        <PinIcon className="h-5 w-5 text-brand-light" />
                        <span className="flex-1 font-semibold">{c.name}, WA</span>
                        <ArrowRight />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <p className="text-neutral-400">{t.area.andMore}</p>
          </div>
          <div data-reveal="zoom">
            <ServiceMap title={t.area.mapTitle} />
          </div>
        </div>
      </Section>
      <CtaBand lang={lang} />
    </>
  );
}
