import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ServiceGlyph, UpArrow } from "../Icons";
import { Section, SectionTitle } from "../ui";
import { getDictionary } from "@/content/dictionary";
import { featuredServices, services } from "@/content/services";
import { localePath, type Locale } from "@/lib/i18n";

/** Bloque 3: Pour concrete · Polishing concrete · Epoxy work (con foto real). */
export function FeaturedServices({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const other: Locale = lang === "en" ? "es" : "en";
  return (
    <Section>
      <SectionTitle eyebrow={t.featured.eyebrow} title={t.featured.title} lead={t.featured.lead} />
      <div className="grid gap-6 md:grid-cols-3" data-reveal-stagger="140">
        {featuredServices.map((s) => (
          <div key={s.slug}>
          <article className="card-lift group flex h-full flex-col overflow-hidden rounded-md border border-line bg-ink-2 hover:border-brand/70">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={s.image}
                alt={s.imageAlt[lang]}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold">{s.featured![lang]}</h3>
              {/* Nombre en el otro idioma: tarjetas bilingües */}
              <p lang={other} className="mt-1 text-sm font-semibold text-brand-light">
                {s.featured![other]}
              </p>
              <ul className="mt-4 grid gap-1.5 text-sm text-neutral-300">
                {s.items[lang].slice(0, 4).map((item) => (
                  <li key={item} className="flex gap-2">
                    <UpArrow className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-light" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={localePath(`/services/${s.slug}`, lang)}
                className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-brand-light hover:text-white"
              >
                {t.common.viewService}
                <span className="sr-only">: {s.name[lang]}</span>
                <ArrowRight />
              </Link>
            </div>
          </article>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** Bloque 4: los 7 servicios → páginas /services/[slug]. */
export function ServicesGrid({ lang, tone = "darker" }: { lang: Locale; tone?: "dark" | "darker" }) {
  const t = getDictionary(lang);
  return (
    <Section tone={tone}>
      <SectionTitle eyebrow={t.services.eyebrow} title={t.services.title} lead={t.services.lead} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger="70">
        {services.map((s, i) => (
          <li key={s.slug}>
            <Link
              href={localePath(`/services/${s.slug}`, lang)}
              className="card-lift group flex h-full flex-col rounded-md border border-line bg-ink p-6 hover:border-brand/70 hover:bg-ink-3"
            >
              <div className="flex items-center justify-between">
                <ServiceGlyph
                  icon={s.icon}
                  className="h-8 w-8 text-brand-light transition duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                />
                <span className="text-sm font-bold text-neutral-500 transition group-hover:text-brand-light">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-lg leading-snug font-bold">{s.name[lang]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{s.short[lang]}</p>
              <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-bold text-brand-light">
                {s.items[lang].length} {t.services.count} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={localePath("/contact", lang)}
            className="card-lift cta-stripes group flex h-full flex-col justify-between rounded-md bg-brand-deep p-6 hover:bg-brand-deeper"
          >
            <ArrowRight className="h-8 w-8 transition duration-300 group-hover:translate-x-2" />
            <span>
              <span className="block text-lg font-bold">{t.services.notSure}</span>
              <span className="mt-2 block text-sm text-white/85">{t.services.notSureCta}</span>
            </span>
          </Link>
        </li>
      </ul>
    </Section>
  );
}
