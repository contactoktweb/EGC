import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { AboutSplit, CtaBand, WhoWeServe, WhyChoose } from "@/components/sections/InfoSections";
import { getPageContent } from "@/lib/content";
import { hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const content = await getPageContent(lang);
  const { t } = content;
  return pageMetadata({ lang, path: "/about", title: t.pages.aboutTitle, description: t.pages.aboutDescription });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const content = await getPageContent(lang);
  const { t, settings } = content;

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: t.nav.about, path: localePath("/about", lang) },
        ]}
        eyebrow={t.about.eyebrow}
        title={t.pages.aboutTitle}
        lead={settings.tagline}
      />
      <AboutSplit lang={lang} full />
      <WhyChoose lang={lang} />
      <WhoWeServe lang={lang} />
      <CtaBand lang={lang} />
    </>
  );
}
