import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PhoneIcon, PinIcon, ShieldIcon } from "../Icons";
import { Section, SectionTitle } from "../ui";
import { CountUp } from "../motion/CountUp";
import aboutImg from "@/content/images/concrete-grinding-polishing-in-progress.jpg";
import { getDictionary } from "@/content/dictionary";
import { cities } from "@/content/cities";
import type { Faq } from "@/content/services";
import { localePath, type Locale } from "@/lib/i18n";
import { site, telHref } from "@/lib/site";

/** Bloque 6: Por qué elegirnos. */
export function WhyChoose({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <Section>
      <SectionTitle eyebrow={t.why.eyebrow} title={t.why.title} />
      <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger="80">
        {t.why.items.map(([title, text], i) => (
          <li key={title} className="group relative pt-4">
            <span aria-hidden="true" className="absolute top-0 left-0 h-[3px] w-full bg-line" />
            <span
              aria-hidden="true"
              className={`reveal-line absolute top-0 left-0 h-[3px] w-full ${i === t.why.items.length - 1 ? "bg-white" : "bg-brand"}`}
            />
            <h3 className="font-bold transition group-hover:text-brand-light">{title}</h3>
            <p className="mt-1.5 text-sm text-neutral-400">{text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Bloque 7: Sobre nosotros (split screen). */
export function AboutSplit({ lang, full = false }: { lang: Locale; full?: boolean }) {
  const t = getDictionary(lang);
  return (
    <Section tone="darker">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-reveal="left" className="group relative aspect-[4/3] overflow-hidden rounded-md">
          <Image
            src={aboutImg}
            alt={t.about.imageAlt}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-1.5 w-1/3 bg-brand" />
        </div>
        <div data-reveal="right">
          <p className="eyebrow mb-3">{t.about.eyebrow}</p>
          <h2 className="text-3xl leading-tight font-bold text-balance md:text-4xl">{t.about.title}</h2>
          <div className="prose-ecg mt-5">
            <p>{t.about.p1}</p>
            <p>{t.about.p2}</p>
            {full && (
              <>
                <p>{t.about.p3}</p>
                <p>{t.about.p4}</p>
              </>
            )}
          </div>
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            {t.about.stats.map(([value, label]) => (
              <div key={label}>
                <dt className="text-xs text-neutral-400">{label}</dt>
                <dd className="text-4xl font-extrabold text-brand-light">
                  <CountUp value={value} />
                </dd>
              </div>
            ))}
          </dl>
          {!full && (
            <Link
              href={localePath("/about", lang)}
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-brand-light hover:text-white"
            >
              {t.common.learnMore} <ArrowRight />
            </Link>
          )}
        </div>
      </div>
    </Section>
  );
}

/** Bloque 8: A quién servimos. */
export function WhoWeServe({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <Section tone="light">
      <SectionTitle eyebrow={t.serve.eyebrow} title={t.serve.title} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-reveal-stagger="110">
        {t.serve.items.map(([title, text]) => (
          <li key={title}>
          <div className="card-lift group h-full rounded-md border border-neutral-300 bg-white p-6 hover:border-brand">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 transition duration-300 group-hover:bg-brand-deep group-hover:text-white">
              <ShieldIcon className="h-7 w-7 text-brand-deep transition group-hover:text-white" />
            </span>
            <h3 className="mt-4 font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{text}</p>
          </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Bloque 9: Área de servicio (SEO local). */
export function ServiceArea({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div data-reveal="left">
          <p className="eyebrow mb-3">{t.area.eyebrow}</p>
          <h2 className="text-3xl font-bold md:text-4xl">{t.area.title}</h2>
          <p className="mt-4 text-neutral-300">{t.area.lead}</p>
          <ul className="mt-6 flex flex-wrap gap-2" data-reveal-stagger="45">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={localePath(`/service-areas/${c.slug}`, lang)}
                  className="group inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-sm transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand/10 hover:text-brand-light"
                >
                  <PinIcon className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5" /> {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-neutral-400">{t.area.andMore}</p>
        </div>
        <div data-reveal="zoom">
          <ServiceMap title={t.area.mapTitle} />
        </div>
      </div>
    </Section>
  );
}

/** Mapa del área. Por defecto centrado en Arlington con zoom amplio: cubre Skagit, Snohomish y el norte de King. */
export function ServiceMap({ title, query = "Arlington, WA", zoom = 8 }: { title: string; query?: string; zoom?: number }) {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-ink-2">
      <iframe
        title={title}
        src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`}
        className="h-[340px] w-full grayscale-[35%]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

/** Preguntas frecuentes con <details> (sin JS) + respuesta visible para GEO. */
export function FaqList({
  faqs,
  lang,
  title,
  tone = "light",
}: {
  faqs: Faq[];
  lang: Locale;
  title: string;
  tone?: "light" | "dark" | "darker";
}) {
  const light = tone === "light";
  return (
    <Section tone={tone}>
      <SectionTitle title={title} />
      <div className="mx-auto max-w-3xl" data-reveal-stagger="80">
        {faqs.map((f, i) => (
          <details
            key={f.q.en}
            open={i === 0}
            className={`group border-b py-5 ${light ? "border-neutral-300" : "border-line"}`}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-bold [&::-webkit-details-marker]:hidden">
              <h3 className="text-base md:text-lg">{f.q[lang]}</h3>
              <span
                aria-hidden="true"
                className={`mt-0.5 text-xl leading-none transition group-open:rotate-45 ${light ? "text-brand-deep" : "text-brand-light"}`}
              >
                +
              </span>
            </summary>
            <p className={`mt-3 leading-relaxed ${light ? "text-neutral-700" : "text-neutral-300"}`}>{f.a[lang]}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/** Franja de llamada a la acción. */
export function CtaBand({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <section className="cta-stripes bg-brand-deep">
      <div data-reveal className="container-site flex flex-col items-start justify-between gap-6 py-12 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold md:text-3xl">{t.cta.title}</h2>
          <p className="mt-2 text-white/90">{t.cta.lead}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href={localePath("/contact", lang)} className="btn hero-lift bg-white text-ink hover:bg-neutral-200">
            {t.nav.estimate}
          </Link>
          <a href={telHref} className="btn btn-outline">
            <PhoneIcon className="h-4 w-4" /> {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
