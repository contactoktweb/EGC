import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/ui";
import { ContactSection } from "@/components/sections/ContactSection";
import { ServiceMap } from "@/components/sections/InfoSections";
import { getPageContent } from "@/lib/content";
import { hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const content = await getPageContent(lang);
  const { t } = content;
  return pageMetadata({ lang, path: "/contact", title: t.pages.contactTitle, description: t.pages.contactDescription });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const content = await getPageContent(lang);
  const { t } = content;

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: t.nav.contact, path: localePath("/contact", lang) },
        ]}
        eyebrow={t.nav.contact}
        title={t.pages.contactTitle}
        lead={t.cta.lead}
      />
      <ContactSection lang={lang} withTitle={false} />
      <Section tone="darker" className="!pt-0">
        <ServiceMap title={t.area.mapTitle} />
      </Section>
    </>
  );
}
