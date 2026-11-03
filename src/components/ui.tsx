import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { JsonLd } from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function SectionTitle({
  eyebrow,
  title,
  lead,
  as: Tag = "h2",
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  as?: "h1" | "h2";
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div data-reveal className={`${align === "center" ? "mx-auto text-center" : ""} mb-10 max-w-3xl ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag className="text-3xl leading-tight font-bold text-balance md:text-4xl">{title}</Tag>
      <span
        aria-hidden="true"
        className={`reveal-line mt-4 block h-1 w-14 rounded bg-brand ${align === "center" ? "mx-auto" : ""}`}
      />
      {lead && <p className="mt-4 text-base leading-relaxed text-pretty opacity-80 md:text-lg">{lead}</p>}
    </div>
  );
}

export function Section({
  children,
  tone = "dark",
  className = "",
  id,
}: {
  children: ReactNode;
  tone?: "dark" | "darker" | "light";
  className?: string;
  id?: string;
}) {
  const tones = {
    dark: "bg-ink text-white",
    darker: "bg-ink-2 text-white",
    light: "on-light bg-paper text-ink",
  };
  return (
    <section id={id} className={`${tones[tone]} py-16 md:py-24 ${className}`}>
      <div className="container-site">{children}</div>
    </section>
  );
}

export type Crumb = { name: string; path: string };

/** Migas de pan visibles + schema BreadcrumbList. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-neutral-400">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((item, i) => (
            <li key={item.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i < items.length - 1 ? (
                <Link href={item.path} className="hover:text-white">
                  {item.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-neutral-200">
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}

/** Encabezado de páginas internas. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-ink-2 py-14 md:py-20">
      <div
        aria-hidden="true"
        className="float-up pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand/15 blur-3xl"
      />
      <div className="container-site relative">
        <div className="hero-rise" style={{ "--d": "0ms" } as CSSProperties}>
          <Breadcrumbs items={crumbs} />
        </div>
        {eyebrow && (
          <p className="hero-rise eyebrow mb-3" style={{ "--d": "80ms" } as CSSProperties}>
            {eyebrow}
          </p>
        )}
        <h1
          className="hero-rise max-w-4xl text-4xl leading-[1.1] font-bold text-balance md:text-5xl"
          style={{ "--d": "140ms" } as CSSProperties}
        >
          {title}
        </h1>
        <span aria-hidden="true" className="hero-bar mt-5 block h-1 w-16 rounded bg-brand" style={{ "--d": "380ms" } as CSSProperties} />
        {lead && (
          <p className="hero-rise mt-5 max-w-3xl text-lg leading-relaxed text-neutral-300" style={{ "--d": "240ms" } as CSSProperties}>
            {lead}
          </p>
        )}
        {children && (
          <div className="hero-rise" style={{ "--d": "340ms" } as CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
