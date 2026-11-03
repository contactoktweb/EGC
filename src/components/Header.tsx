"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ChevronDown, CloseIcon, MenuIcon, PhoneIcon } from "./Icons";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
  nav: Dictionary["nav"];
  services: { slug: string; name: string }[];
  phoneDisplay: string;
  telHref: string;
};

export function Header({ lang, nav, services, phoneDisplay, telHref }: Props) {
  const pathname = usePathname() || `/${lang}`;
  // El menú queda abierto solo en la ruta donde se abrió: al navegar se cierra solo.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  // Bloquea el scroll del fondo con el menú abierto.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const href = (path: string) => `/${lang}${path === "/" ? "" : path}`;
  const switchTo = (target: Locale) => pathname.replace(/^\/(en|es)(?=\/|$)/, `/${target}`);
  const isActive = (path: string) => {
    const full = href(path);
    return path === "/" ? pathname === full : pathname.startsWith(full);
  };

  const links = [
    { path: "/projects", label: nav.projects },
    { path: "/about", label: nav.about },
    { path: "/service-areas", label: nav.areas },
    { path: "/contact", label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/85">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-brand-deep focus:px-3 focus:py-2"
      >
        {nav.skip}
      </a>
      <div className="container-site flex h-[72px] items-center justify-between gap-6">
        <Link href={href("/")} aria-label="ECG Construction — home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.92rem] text-neutral-200">
            <li className="group relative">
              <Link
                href={href("/services")}
                className={`inline-flex items-center gap-1 py-6 hover:text-white ${isActive("/services") ? "text-white" : ""}`}
                aria-haspopup="true"
              >
                {nav.services} <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-1/2 top-full w-80 -translate-x-1/2 translate-y-1 rounded-md border border-line bg-ink-2 p-2 opacity-0 shadow-2xl transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <ul>
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={href(`/services/${s.slug}`)}
                        className="block rounded px-3 py-2 text-sm text-neutral-200 hover:bg-ink-3 hover:text-white"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                  <li className="mt-1 border-t border-line pt-1">
                    <Link
                      href={href("/services")}
                      className="block rounded px-3 py-2 text-sm font-semibold text-brand-light hover:bg-ink-3"
                    >
                      {nav.allServices} →
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            {links.map((l) => (
              <li key={l.path}>
                <Link
                  href={href(l.path)}
                  className={`hover:text-white ${isActive(l.path) ? "text-white underline decoration-brand decoration-2 underline-offset-8" : ""}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href={telHref} className="hidden items-center gap-2 text-sm font-semibold xl:inline-flex">
            <PhoneIcon className="h-4 w-4 text-brand-light" />
            {phoneDisplay}
          </a>
          <LangSwitch lang={lang} switchTo={switchTo} label={nav.language} />
          <Link href={href("/contact")} className="btn btn-primary hidden !py-2.5 text-sm sm:inline-flex">
            {nav.estimate}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{open ? nav.close : nav.menu}</span>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-ink lg:hidden"
      >
        <nav aria-label="Mobile" className="container-site py-4">
          <p className="eyebrow mb-2">{nav.services}</p>
          <ul className="mb-4 grid gap-1">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={href(`/services/${s.slug}`)} className="block rounded px-2 py-2 text-neutral-200 hover:bg-ink-2">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="grid gap-1 border-t border-line pt-3 text-lg font-semibold">
            <li>
              <Link href={href("/")} className="block px-2 py-2">
                {nav.home}
              </Link>
            </li>
            {links.map((l) => (
              <li key={l.path}>
                <Link href={href(l.path)} className="block px-2 py-2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a href={telHref} className="btn btn-outline">
              <PhoneIcon className="h-4 w-4" /> {phoneDisplay}
            </a>
            <Link href={href("/contact")} className="btn btn-primary">
              {nav.estimate}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

function LangSwitch({
  lang,
  switchTo,
  label,
}: {
  lang: Locale;
  switchTo: (l: Locale) => string;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex rounded-full border border-line p-0.5 text-xs font-bold">
      {(["en", "es"] as const).map((l) => (
        <Link
          key={l}
          href={switchTo(l)}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 uppercase ${l === lang ? "bg-brand-deep text-white" : "text-neutral-300 hover:text-white"}`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
