import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { ServiceMarquee } from "@/components/motion/ServiceMarquee";
import { FeaturedServices, ServicesGrid } from "@/components/sections/ServiceSections";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { AboutSplit, FaqList, ServiceArea, WhoWeServe, WhyChoose } from "@/components/sections/InfoSections";
import { ContactSection } from "@/components/sections/ContactSection";
import { Reviews } from "@/components/sections/Reviews";
import { Section, SectionTitle } from "@/components/ui";
import { JsonLd } from "@/components/JsonLd";
import { ArrowRight } from "@/components/Icons";
import { getPageContent } from "@/lib/content";
import { hasLocale, localePath } from "@/lib/i18n";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const content = await getPageContent(lang);
  const { t } = content;
  return pageMetadata({
    lang,
    path: "/",
    title: t.pages.homeTitle,
    description: t.pages.homeDescription,
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const content = await getPageContent(lang);
  const { t } = content;

  return (
    <>
      {/* 2 · Hero */}
      <Hero lang={lang} />
      {/* Franja animada con todos los servicios */}
      <ServiceMarquee lang={lang} />
      {/* 3 · Servicios destacados: Pour concrete / Polishing / Epoxy */}
      <FeaturedServices lang={lang} />
      {/* 4 · Los 7 servicios */}
      <ServicesGrid lang={lang} />
      {/* 5 · Galería con filtros */}
      <Section tone="light">
        <SectionTitle eyebrow={t.projects.eyebrow} title={t.projects.title} lead={t.projects.lead} />
        <ProjectGallery projects={content.projects} lang={lang} labels={t.projects} limit={12} />
        <div data-reveal className="mt-10 text-center">
          <Link href={localePath("/projects", lang)} className="btn btn-primary hero-lift">
            {t.common.seeAllProjects} <ArrowRight />
          </Link>
        </div>
      </Section>
      {/* 6 · Por qué elegirnos */}
      <WhyChoose lang={lang} />
      {/* Reseñas de clientes (solo si hay reseñas cargadas en Sanity) */}
      <Reviews lang={lang} />
      {/* 7 · Sobre nosotros */}
      <AboutSplit lang={lang} />
      {/* 8 · A quién servimos */}
      <WhoWeServe lang={lang} />
      {/* 9 · Área de servicio */}
      <ServiceArea lang={lang} />
      {/* 10 · Preguntas frecuentes */}
      <FaqList faqs={content.faqs} lang={lang} title={t.common.faq} />
      <JsonLd data={faqJsonLd(lang, content.faqs)} />
      {/* 11 · Estimado gratis */}
      <ContactSection lang={lang} />
    </>
  );
}
