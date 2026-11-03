import Image from "next/image";
import Link from "next/link";
import { BrandWave } from "../Logo";
import { PhoneIcon, UpArrow } from "../Icons";
import heroImg from "@/content/images/decorative-flake-epoxy-garage-floor.jpg";
import { getDictionary } from "@/content/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { site, telHref } from "@/lib/site";

export function Hero({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="grid lg:min-h-[620px] lg:grid-cols-[1.08fr_0.92fr]">
        <div className="container-site flex flex-col justify-center py-16 lg:mr-0 lg:max-w-[660px] lg:py-24 lg:pr-12">
          <p className="eyebrow mb-5">{t.hero.eyebrow}</p>
          <h1 className="text-4xl leading-[1.08] font-extrabold text-balance sm:text-5xl lg:text-[3.4rem]">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-300">{t.hero.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={localePath("/contact", lang)} className="btn btn-primary">
              {t.common.requestEstimate}
            </Link>
            <a href={telHref} className="btn btn-outline">
              <PhoneIcon className="h-4 w-4" /> {t.common.call} {site.phoneDisplay}
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {t.hero.badges.map((b) => (
              <li
                key={b}
                className="inline-flex items-center gap-1.5 rounded border border-line px-3 py-1.5 text-xs font-semibold text-neutral-200"
              >
                <UpArrow className="h-3.5 w-3.5 text-brand-light" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative min-h-[300px] sm:min-h-[420px] lg:min-h-full">
          <Image
            src={heroImg}
            alt={t.hero.imageAlt}
            fill
            priority
            fetchPriority="high"
            placeholder="blur"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink via-ink/10 to-transparent lg:via-transparent" />
        </div>
      </div>
      <BrandWave className="absolute right-0 bottom-0 left-0 h-12 w-full" />
    </section>
  );
}
