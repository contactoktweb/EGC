import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/ui";
import { ReviewForm } from "@/components/sections/ReviewForm";
import { getPageContent } from "@/lib/content";
import { hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

/**
 * Página para compartir con los clientes (WhatsApp, correo, SMS): abre directamente el formulario
 * de reseña. Las reseñas llegan al panel como "Pendiente" y se publican al aprobarlas.
 * URL: /en/review y /es/review.
 */
export async function generateMetadata({
  params,
}: PageProps<"/[lang]/review">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { t, settings } = await getPageContent(lang);
  return {
    ...pageMetadata({
      lang,
      path: "/review",
      title: `${t.reviews.formTitle} · ${settings.name}`,
      description: t.reviews.formLead,
    }),
    robots: { index: false, follow: true },
  };
}

export default async function ReviewPage({
  params,
}: PageProps<"/[lang]/review">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { t, services, settings } = await getPageContent(lang);

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: t.reviews.write, path: localePath("/review", lang) },
        ]}
        title={t.reviews.formTitle}
        lead={t.reviews.formLead}
      />
      <Section>
        <ReviewForm
          labels={t.reviews}
          lang={lang}
          startOpen
          services={services.map((s) => ({
            value: s.slug,
            label: s.name[lang],
          }))}
        />
        {settings.googleReviewUrl && (
          <p className="mt-8 text-center">
            <a
              href={settings.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              {t.reviews.leaveReview}
            </a>
          </p>
        )}
      </Section>
    </>
  );
}
