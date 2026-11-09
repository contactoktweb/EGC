import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/ui";
import { RichText } from "@/components/RichText";
import { getContent, getPageContent } from "@/lib/content";
import { hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const p = (await getContent()).privacy[lang];
  return pageMetadata({ lang, path: "/privacy", title: p.title, description: p.description });
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const content = await getPageContent(lang);
  const { t } = content;
  const p = content.privacy[lang];

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: p.title, path: localePath("/privacy", lang) },
        ]}
        title={p.title}
        lead={p.updated}
      />
      <Section>
        <article className="mx-auto max-w-3xl text-lg [&>p:first-child]:text-neutral-200">
          <RichText value={p.body} />
        </article>
      </Section>
    </>
  );
}
