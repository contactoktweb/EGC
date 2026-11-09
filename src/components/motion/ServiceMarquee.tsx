import { UpArrow } from "../Icons";
import type { Locale } from "@/lib/i18n";
import { getPageContent } from "@/lib/content";

/** Franja verde con los servicios desplazándose en bucle (se pausa al pasar el mouse). */
export async function ServiceMarquee({ lang }: { lang: Locale }) {
  const { services } = await getPageContent(lang);
  const items = services.flatMap((s) => [s.featured?.[lang] ?? s.name[lang]]);
  const row = (hidden: boolean) => (
    <ul className="marquee-row flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((label) => (
        <li key={label} className="flex items-center gap-3 whitespace-nowrap">
          <UpArrow className="h-4 w-4 text-white/70" />
          <span className="text-sm font-bold tracking-[0.18em] uppercase">{label}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee relative flex overflow-hidden border-y border-brand-deeper bg-brand-deep py-4 text-white">
      {row(false)}
      {row(true)}
    </div>
  );
}
