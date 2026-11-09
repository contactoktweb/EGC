import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandWave } from "../Logo";
import { ArrowRight, PhoneIcon, ServiceGlyph, UpArrow } from "../Icons";
import { localePath, type Locale } from "@/lib/i18n";
import { getPageContent } from "@/lib/content";
import { featuredOf, telHref } from "@/lib/content/helpers";

/** Retraso escalonado para la animación de entrada (ms). */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export async function Hero({ lang }: { lang: Locale }) {
  const content = await getPageContent(lang);
  const { t, settings } = content;
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="grid lg:min-h-[640px] lg:grid-cols-[1.08fr_0.92fr]">
        {/* Texto: entra en secuencia (eyebrow → título → texto → botones → sellos) */}
        <div className="container-site relative z-10 flex flex-col justify-center py-16 lg:mr-0 lg:max-w-[660px] lg:py-24 lg:pr-12">
          <p className="hero-rise eyebrow mb-5 flex items-center gap-2" style={delay(0)}>
            <UpArrow className="hero-arrow h-4 w-4 shrink-0" />
            {t.hero.eyebrow}
          </p>
          <h1
            className="hero-rise text-4xl leading-[1.08] font-extrabold text-balance sm:text-5xl lg:text-[3.4rem]"
            style={delay(90)}
          >
            {t.hero.title}
          </h1>
          <span aria-hidden="true" className="hero-bar mt-6 block h-1 w-20 rounded bg-brand" style={delay(350)} />
          <p className="hero-rise mt-6 max-w-xl text-lg leading-relaxed text-neutral-300" style={delay(220)}>
            {t.hero.lead}
          </p>
          <div className="hero-rise mt-8 flex flex-wrap gap-3" style={delay(340)}>
            <Link href={localePath("/contact", lang)} className="btn btn-primary hero-lift">
              {t.common.requestEstimate}
            </Link>
            <a href={telHref(settings)} className="btn btn-outline hero-lift">
              <PhoneIcon className="h-4 w-4" /> {t.common.call} {settings.phoneDisplay}
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {t.hero.badges.map((b, i) => (
              <li
                key={b}
                className="hero-rise inline-flex items-center gap-1.5 rounded border border-line bg-ink/60 px-3 py-1.5 text-xs font-semibold text-neutral-200"
                style={delay(460 + i * 90)}
              >
                <UpArrow className="h-3.5 w-3.5 text-brand-light" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Imagen: se descubre de derecha a izquierda con un zoom suave */}
        <div className="hero-reveal relative min-h-[420px] overflow-hidden sm:min-h-[480px] lg:min-h-full">
          <Image
            src={content.images.hero}
            alt={t.hero.imageAlt}
            fill
            priority
            fetchPriority="high"
            placeholder="blur"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="hero-zoom object-cover"
          />
          {/* Degradado: arriba en móvil (une con el texto), a la izquierda en escritorio */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-ink via-transparent via-30% to-ink/40 lg:bg-gradient-to-r lg:from-ink lg:via-transparent lg:via-30% lg:to-transparent"
          />

          {/* Tarjeta con los 3 servicios principales: se entiende qué hacemos de un vistazo */}
          <div
            className="hero-rise absolute right-4 bottom-14 left-4 rounded-md border border-white/10 bg-ink/85 p-4 shadow-2xl backdrop-blur-md sm:right-auto sm:w-[320px] lg:bottom-16 lg:left-auto lg:right-8"
            style={delay(700)}
          >
            <p className="eyebrow mb-3 !text-[0.65rem]">{t.featured.eyebrow}</p>
            <ul className="grid gap-1">
              {featuredOf(content.services).map((s, i) => (
                <li key={s.slug} className="hero-rise" style={delay(820 + i * 110)}>
                  <Link
                    href={localePath(`/services/${s.slug}`, lang)}
                    className="group flex items-center gap-3 rounded px-2 py-2 transition hover:bg-white/5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-deep/90">
                      <ServiceGlyph icon={s.icon} className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-sm font-bold">{s.featured![lang]}</span>
                    <ArrowRight className="h-4 w-4 text-brand-light transition group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Línea curva verde del logo: se dibuja de izquierda a derecha */}
      <BrandWave className="hero-wave pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-12 w-full" />
    </section>
  );
}
