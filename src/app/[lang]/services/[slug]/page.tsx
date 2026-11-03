import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Section, SectionTitle } from "@/components/ui";
import { ArrowRight, PhoneIcon, ServiceGlyph, UpArrow } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { CtaBand, FaqList, WhyChoose } from "@/components/sections/InfoSections";
import { getDictionary } from "@/content/dictionary";
import { getService, services } from "@/content/services";
import { projectsByCategory } from "@/content/projects";
import { cities } from "@/content/cities";
import { hasLocale, localePath } from "@/lib/i18n";
import { faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { site, telHref } from "@/lib/site";

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const s = getService(slug);
  if (!hasLocale(lang) || !s) return {};
  const where = lang === "en" ? "in Snohomish & King County, WA" : "en Snohomish y King County, WA";
  return pageMetadata({
    lang,
    path: `/services/${s.slug}`,
    title: `${s.name[lang]} ${where}`,
    description:
      lang === "en"
        ? `${s.name.en} ${where} by ECG Construction LLC: ${s.short.en.toLowerCase()} Licensed, bonded & insured. Free estimates.`
        : `${s.name.es} ${where} con ECG Construction LLC: ${s.short.es.toLowerCase()} Licencia, fianza y seguro. Estimados gratis.`,
  });
}

export default async function ServicePage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  const s = getService(slug);
  if (!hasLocale(lang) || !s) notFound();
  const t = getDictionary(lang);
  const gallery = s.gallery ? projectsByCategory(s.gallery) : [];
  const related = s.related.map(getService).filter((x) => x !== undefined);

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: t.nav.services, path: localePath("/services", lang) },
          { name: s.name[lang], path: localePath(`/services/${s.slug}`, lang) },
        ]}
        eyebrow={s.featured ? s.featured[lang] : t.services.eyebrow}
        title={s.name[lang]}
        lead={s.intro[lang]}
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
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">{t.common.whatWeOffer}</p>
            <h2 className="text-3xl font-bold">{s.name[lang]}</h2>
            <ul className="mt-6 grid gap-3">
              {s.items[lang].map((item) => (
                <li key={item} className="flex gap-3 rounded border border-line bg-ink-2 px-4 py-3">
                  <UpArrow className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-md lg:sticky lg:top-28">
            <Image
              src={s.image}
              alt={s.imageAlt[lang]}
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      {gallery.length > 0 && (
        <Section tone="light">
          <SectionTitle eyebrow={t.projects.eyebrow} title={t.projects.title} />
          <ProjectGallery projects={gallery} lang={lang} labels={t.projects} showFilters={false} />
        </Section>
      )}

      <WhyChoose lang={lang} />

      <FaqList faqs={s.faqs} lang={lang} title={t.common.faq} />
      <JsonLd data={faqJsonLd(lang, s.faqs)} />
      <JsonLd data={serviceJsonLd(lang, s.slug)} />

      <Section tone="darker">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-5 text-2xl font-bold">{t.common.relatedServices}</h2>
            <ul className="grid gap-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={localePath(`/services/${r.slug}`, lang)}
                    className="flex items-center gap-3 rounded border border-line bg-ink px-4 py-3 hover:border-brand"
                  >
                    <ServiceGlyph icon={r.icon} className="h-6 w-6 text-brand-light" />
                    <span className="flex-1 font-semibold">{r.name[lang]}</span>
                    <ArrowRight />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-5 text-2xl font-bold">
              {s.name[lang]} — {t.nav.areas}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={localePath(`/service-areas/${c.slug}`, lang)}
                    className="inline-block rounded-full border border-line px-3 py-1.5 text-sm hover:border-brand hover:text-brand-light"
                  >
                    {c.name}, WA
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand lang={lang} />
    </>
  );
}

