import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/ui";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { CtaBand } from "@/components/sections/InfoSections";
import { getDictionary } from "@/content/dictionary";
import { projects } from "@/content/projects";
import { hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: "/projects", title: t.pages.projectsTitle, description: t.pages.projectsDescription });
}

export default async function ProjectsPage({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: t.nav.projects, path: localePath("/projects", lang) },
        ]}
        eyebrow={t.projects.eyebrow}
        title={t.pages.projectsTitle}
        lead={t.projects.lead}
      />
      <Section tone="light">
        <ProjectGallery projects={projects} lang={lang} labels={t.projects} />
      </Section>
      <CtaBand lang={lang} />
    </>
  );
}
