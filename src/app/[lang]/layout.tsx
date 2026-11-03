import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { services } from "@/content/services";
import { getDictionary } from "@/content/dictionary";
import { hasLocale, htmlLang, locales } from "@/lib/i18n";
import { businessJsonLd, websiteJsonLd } from "@/lib/seo";
import { site, telHref } from "@/lib/site";

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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.legalName, template: `%s | ${site.legalName}` },
  applicationName: site.legalName,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: true, email: true, address: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  category: "construction",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={htmlLang[lang]} className={archivo.variable} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        {/* Marca <html data-js> antes del primer pintado: activa las animaciones de scroll sin parpadeo. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.setAttribute("data-js","")` }} />
        <ScrollReveal />
        <Header
          lang={lang}
          nav={t.nav}
          services={services.map((s) => ({ slug: s.slug, name: s.name[lang] }))}
          phoneDisplay={site.phoneDisplay}
          telHref={telHref}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer lang={lang} />
        <JsonLd data={businessJsonLd(lang)} />
        <JsonLd data={websiteJsonLd(lang)} />
      </body>
    </html>
  );
}
