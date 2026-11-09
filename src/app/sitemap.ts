import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { cities, counties } from "@/content/cities";
import { localePath, locales } from "@/lib/i18n";
import { site } from "@/lib/site";

const paths: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
  { path: "/", priority: 1, changeFrequency: "monthly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.9, changeFrequency: "monthly" as const })),
  { path: "/projects", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "yearly" },
  { path: "/service-areas", priority: 0.7, changeFrequency: "yearly" },
  ...counties.map((c) => ({ path: `/service-areas/${c.slug}`, priority: 0.7, changeFrequency: "yearly" as const })),
  ...cities.map((c) => ({ path: `/service-areas/${c.slug}`, priority: 0.7, changeFrequency: "yearly" as const })),
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((lang) => ({
      url: `${site.url}${localePath(path, lang)}`,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          "en-US": `${site.url}${localePath(path, "en")}`,
          "es-US": `${site.url}${localePath(path, "es")}`,
          "x-default": `${site.url}${localePath(path, "en")}`,
        },
      },
    })),
  );
}
