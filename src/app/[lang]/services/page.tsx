import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/ui";
import { ArrowRight, ServiceGlyph, UpArrow } from "@/components/Icons";
import { CtaBand } from "@/components/sections/InfoSections";
import { getDictionary } from "@/content/dictionary";
import { services } from "@/content/services";
import { hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/services", title: t.pages.servicesTitle, description: t.pages.servicesDescription });
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: t.nav.services, path: localePath("/services", lang) },
        ]}
        eyebrow={t.services.eyebrow}
        title={t.pages.servicesTitle}
        lead={t.services.lead}
      />
      <Section>
        <div className="grid gap-8">
          {services.map((s, i) => (
            <article
              key={s.slug}
              id={s.slug}
              className="grid overflow-hidden rounded-md border border-line bg-ink-2 md:grid-cols-[0.8fr_1.2fr]"
            >
              <div className={`relative min-h-[220px] ${i % 2 ? "md:order-2" : ""}`}>
                <Image
                  src={s.image}
                  alt={s.imageAlt[lang]}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <ServiceGlyph icon={s.icon} className="h-8 w-8 text-brand-light" />
                  <span className="text-sm font-bold text-neutral-500">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h2 className="mt-4 text-2xl font-bold">
                  <Link href={localePath(`/services/${s.slug}`, lang)} className="hover:text-brand-light">
                    {s.name[lang]}
                  </Link>
                </h2>
                <p className="mt-2 text-neutral-300">{s.short[lang]}</p>
                <ul className="mt-5 grid gap-x-6 gap-y-1.5 text-sm text-neutral-300 sm:grid-cols-2">
                  {s.items[lang].map((item) => (
                    <li key={item} className="flex gap-2">
                      <UpArrow className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-light" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={localePath(`/services/${s.slug}`, lang)}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-light hover:text-white"
                >
                  {t.common.viewService}
                  <span className="sr-only">: {s.name[lang]}</span> <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <CtaBand lang={lang} />
    </>
  );
}
