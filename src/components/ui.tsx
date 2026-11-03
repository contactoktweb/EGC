import Link from "next/link";
import type { ReactNode } from "react";
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
    <div className={`${align === "center" ? "mx-auto text-center" : ""} mb-10 max-w-3xl ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag className="text-3xl leading-tight font-bold text-balance md:text-4xl">{title}</Tag>
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
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand/10 blur-3xl"
      />
      <div className="container-site relative">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-4xl text-4xl leading-[1.1] font-bold text-balance md:text-5xl">{title}</h1>
        {lead && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-300">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
