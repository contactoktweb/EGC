import { ContactForm } from "./ContactForm";
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, UserIcon } from "../Icons";
import { Section, SectionTitle } from "../ui";
import { localePath, type Locale } from "@/lib/i18n";
import { getPageContent } from "@/lib/content";
import { mailHref, telHref } from "@/lib/content/helpers";

/** Bloque 11: formulario de estimado + datos del negocio. */
export async function ContactSection({ lang, withTitle = true }: { lang: Locale; withTitle?: boolean }) {
  const content = await getPageContent(lang);
  const { t, settings } = content;
  const info = [
    { icon: UserIcon, label: t.common.contactPerson, value: settings.contactName },
    { icon: PhoneIcon, label: t.common.phone, value: settings.phoneDisplay, href: telHref(settings) },
    { icon: MailIcon, label: t.common.email, value: settings.email, href: mailHref(settings) },
    { icon: ClockIcon, label: t.common.hours, value: t.common.hoursValue, extra: t.common.weekend },
    { icon: PinIcon, label: t.common.serviceArea, value: t.common.serviceAreaValue },
  ];

  return (
    <Section id="estimate">
      {withTitle && <SectionTitle title={t.cta.title} lead={t.cta.lead} />}
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
        <div data-reveal="left">
        <ContactForm
          lang={lang}
          labels={t.form}
          services={content.services.map((s) => ({ value: s.name.en, label: s.name[lang] }))}
          cities={content.cities.map((c) => c.name)}
          privacy={{ href: localePath("/privacy", lang), label: t.nav.privacy }}
        />
        </div>
        <address className="not-italic">
          <ul className="grid gap-6" data-reveal-stagger="90">
            {info.map(({ icon: Icon, label, value, href, extra }) => (
              <li key={label} className="group flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-brand-light transition duration-300 group-hover:border-brand group-hover:bg-brand-deep group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs font-bold tracking-[0.14em] text-brand-light uppercase">{label}</span>
                  {href ? (
                    <a href={href} className="mt-1 block break-all text-neutral-100 hover:text-white">
                      {value}
                    </a>
                  ) : (
                    <span className="mt-1 block text-neutral-100">{value}</span>
                  )}
                  {extra && <span className="mt-1 block text-sm text-neutral-400">{extra}</span>}
                </span>
              </li>
            ))}
          </ul>
        </address>
      </div>
    </Section>
  );
}
