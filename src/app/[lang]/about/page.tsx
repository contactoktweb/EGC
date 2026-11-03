import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui";
import { AboutSplit, CtaBand, WhoWeServe, WhyChoose } from "@/components/sections/InfoSections";
import { getDictionary } from "@/content/dictionary";
import { hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/about", title: t.pages.aboutTitle, description: t.pages.aboutDescription });
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: t.nav.about, path: localePath("/about", lang) },
        ]}
        eyebrow={t.about.eyebrow}
        title={t.pages.aboutTitle}
        lead={site.tagline}
      />
      <AboutSplit lang={lang} full />
      <WhyChoose lang={lang} />
      <WhoWeServe lang={lang} />
      <CtaBand lang={lang} />
    </>
  );
}
