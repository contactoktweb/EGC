import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Section } from "@/components/ui";
import { getDictionary } from "@/content/dictionary";
import { privacy } from "@/content/privacy";
import { hasLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const p = privacy[lang];
  return pageMetadata({ lang, path: "/privacy", title: p.title, description: p.description });
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);
  const p = privacy[lang];

  return (
    <>
      <PageHero
        crumbs={[
          { name: t.common.breadcrumbHome, path: localePath("/", lang) },
          { name: p.title, path: localePath("/privacy", lang) },
        ]}
        title={p.title}
        lead={p.updated}
      />
      <Section>
        <article className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-neutral-200">{p.intro}</p>
          {p.sections.map((s) => (
            <section key={s.title} className="mt-10">
              <h2 className="mb-3 text-xl font-bold">{s.title}</h2>
              {s.paragraphs?.map((para) => (
                <p key={para} className="mb-3 leading-relaxed text-neutral-300">
                  {para}
                </p>
              ))}
              {s.bullets && (
                <ul className="grid gap-2 pl-5 text-neutral-300 marker:text-brand-light [list-style:disc]">
                  {s.bullets.map((b) => (
                    <li key={b} className="leading-relaxed">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </Section>
    </>
  );
}
