import { Section, SectionTitle } from "../ui";
import { getPageContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import type { Review } from "@/lib/content/types";
import { ReviewForm } from "./ReviewForm";

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <span
      className="flex gap-0.5 text-amber-400"
      role="img"
      aria-label={`${rating} ${label}`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "" : "opacity-25"}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Reseñas reales de clientes (Sanity → Reseñas, solo las aprobadas).
 * - `withForm`: muestra el botón para que el cliente deje su reseña (queda pendiente de aprobación).
 *   Con formulario la sección se ve aunque aún no haya reseñas; sin él, se oculta si no hay ninguna.
 * - `service` filtra las reseñas de un servicio concreto.
 */
export async function Reviews({
  lang,
  service,
  limit = 6,
  withForm = false,
}: {
  lang: Locale;
  service?: string;
  limit?: number;
  withForm?: boolean;
}) {
  const { t, reviews, settings, services } = await getPageContent(lang);
  const list: Review[] = (
    service ? reviews.filter((r) => r.service === service) : reviews
  ).slice(0, limit);
  if (list.length === 0 && !withForm) return null;

  const dateFmt = new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <Section tone="darker">
      <SectionTitle
        eyebrow={t.reviews.eyebrow}
        title={t.reviews.title}
        lead={t.reviews.lead}
      />
      {list.length === 0 && (
        <p
          data-reveal
          className="mx-auto mb-8 max-w-xl text-center text-neutral-300"
        >
          {t.reviews.empty}
        </p>
      )}
      {list.length > 0 && (
        <ul
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          data-reveal-stagger="100"
        >
          {list.map((r) => (
            <li key={r.id}>
              <figure className="card-lift flex h-full flex-col rounded-md border border-line bg-ink p-6">
                <div className="flex items-center justify-between gap-3">
                  <Stars rating={r.rating} label={t.reviews.outOf} />
                  <span className="rounded-full border border-line px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wide text-neutral-300 uppercase">
                    {r.source}
                  </span>
                </div>
                <blockquote className="mt-4 flex-1 leading-relaxed text-neutral-200">
                  “{r.text[lang]}”
                </blockquote>
                <figcaption className="mt-5 flex items-end justify-between gap-3 text-sm">
                  <span>
                    <span className="block font-bold text-white">
                      {r.author}
                      {r.city && (
                        <span className="font-normal text-neutral-400">
                          {" "}
                          · {r.city}
                        </span>
                      )}
                    </span>
                    {r.date && (
                      <span className="text-neutral-400">
                        {dateFmt.format(new Date(r.date))}
                      </span>
                    )}
                  </span>
                  {r.link && (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-light underline-offset-4 hover:underline"
                    >
                      {t.reviews.readReview}
                    </a>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
      {(withForm || settings.googleReviewUrl) && (
        <div
          data-reveal
          className="mt-10 flex flex-wrap items-start justify-center gap-4 text-center"
        >
          {withForm && (
            <div className="w-full">
              <ReviewForm
                labels={t.reviews}
                lang={lang}
                services={services.map((s) => ({
                  value: s.slug,
                  label: s.name[lang],
                }))}
              />
            </div>
          )}
          {settings.googleReviewUrl && (
            <a
              href={settings.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline hero-lift"
            >
              <Stars rating={5} label={t.reviews.outOf} />{" "}
              {t.reviews.leaveReview}
            </a>
          )}
        </div>
      )}
    </Section>
  );
}
