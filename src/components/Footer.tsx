import Link from "next/link";
import { BrandWave, Logo } from "./Logo";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon } from "./Icons";
import { getDictionary } from "@/content/dictionary";
import { services } from "@/content/services";
import { cities } from "@/content/cities";
import { localePath, type Locale } from "@/lib/i18n";
import { mailHref, site, telHref } from "@/lib/site";

export function Footer({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const href = (p: string) => localePath(p, lang);

  return (
    <footer className="mt-auto bg-ink text-sm text-neutral-300">
      <BrandWave className="block h-10 w-full" />
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs leading-relaxed">
            {site.legalName}. {t.common.licensed}. {site.slogan}
          </p>
          {site.contractorLicense && (
            <p className="mt-3 text-xs text-neutral-400">
              {t.common.license}
              {site.contractorLicense}
            </p>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold tracking-[0.18em] text-white uppercase">{t.nav.services}</h2>
          <ul className="grid gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={href(`/services/${s.slug}`)} className="hover:text-white">
                  {s.name[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold tracking-[0.18em] text-white uppercase">{t.nav.areas}</h2>
          <ul className="grid grid-cols-2 gap-2">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link href={href(`/service-areas/${c.slug}`)} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold tracking-[0.18em] text-white uppercase">{t.nav.contact}</h2>
          <ul className="grid gap-3">
            <li className="flex gap-2">
              <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
              <a href={telHref} className="hover:text-white">
                {site.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2">
              <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
              <a href={mailHref} className="break-all hover:text-white">
                {site.email}
              </a>
            </li>
            <li className="flex gap-2">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
              <span>{t.common.hoursShort}</span>
            </li>
            <li className="flex gap-2">
              <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
              <span>{t.common.serviceAreaValue}</span>
            </li>
          </ul>
          <Link href={href("/contact")} className="btn btn-primary mt-5 !py-2.5 text-sm">
            {t.nav.estimate}
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-5 text-xs text-neutral-400 md:flex-row">
          <p>
            © <CopyrightYear /> {site.legalName}. {t.common.rights}
          </p>
          <p className="tracking-[0.45em] text-neutral-300 uppercase">{t.common.generalConstruction}</p>
          <p className="flex gap-3">
            <Link href="/en" hrefLang="en" className={lang === "en" ? "text-white" : "hover:text-white"}>
              English
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/es" hrefLang="es" className={lang === "es" ? "text-white" : "hover:text-white"}>
              Español
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** Año actual cacheado (Cache Components no permite leer la hora en el render estático). */
async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}
