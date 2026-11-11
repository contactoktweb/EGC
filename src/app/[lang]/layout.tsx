import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AssistantWidget } from "@/components/AssistantWidget";
import { hasLocale, htmlLang, locales } from "@/lib/i18n";
import { businessJsonLd, websiteJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { getContent } from "@/lib/content";
import { telHref } from "@/lib/content/helpers";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#1b1a1b",
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getContent();
  const name = settings.legalName;
  return {
    metadataBase: new URL(site.url),
    title: { default: name, template: `%s | ${name}` },
    applicationName: name,
    authors: [{ name }],
    creator: name,
    publisher: name,
    formatDetection: { telephone: true, email: true, address: false },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    category: "construction",
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const content = await getContent();
  const t = content.dict[lang];

  return (
    <html lang={htmlLang[lang]} className={archivo.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        {/* Marca <html data-js> antes del primer pintado: activa las animaciones de scroll sin parpadeo. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.setAttribute("data-js","")` }} />
        <ScrollReveal />
        <Header
          lang={lang}
          nav={t.nav}
          services={content.services.map((s) => ({ slug: s.slug, name: s.name[lang] }))}
          phoneDisplay={content.settings.phoneDisplay}
          telHref={telHref(content.settings)}
          logo={content.settings.logo}
          logoAlt={content.settings.legalName}
        />
        {/* overflow-x-clip: recorta las animaciones laterales sin scroll horizontal (no rompe sticky). */}
        <main id="main" className="flex-1 overflow-x-clip">
          {children}
        </main>
        <Footer lang={lang} />
        {/* Asistente de IA: activo si hay ANTHROPIC_API_KEY y está encendido en Configuración general. */}
        {process.env.ANTHROPIC_API_KEY && content.settings.assistantEnabled && (
          <AssistantWidget lang={lang} labels={t.assistant} />
        )}
        <JsonLd data={businessJsonLd(content, lang)} />
        <JsonLd data={websiteJsonLd(content, lang)} />
      </body>
    </html>
  );
}
