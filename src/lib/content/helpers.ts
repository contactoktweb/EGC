import type { City, County, CountyKey, Project, ProjectCategory, Service, Settings } from "./types";

export const telHref = (s: Settings) => `tel:${s.phoneE164}`;
export const mailHref = (s: Settings) => `mailto:${s.email}`;
/** Texto obligatorio del registro L&I (igual en inglés y español). */
export const contractorRegText = (s: Settings) => `WA Contractor Reg # ${s.contractorLicense}`;

export const findService = (services: Service[], slug: string) => services.find((s) => s.slug === slug);
export const featuredOf = (services: Service[]) => services.filter((s) => s.featured);
export const projectsIn = (projects: Project[], category: ProjectCategory) => projects.filter((p) => p.category === category);

export const findCity = (cities: City[], slug: string) => cities.find((c) => c.slug === slug);
export const findCounty = (counties: County[], slug: string) => counties.find((c) => c.slug === slug);
export const citiesIn = (cities: City[], county: CountyKey) => cities.filter((c) => c.county === county);

/** "Snohomish County" / "condado de Snohomish". */
export function countyLabel(counties: County[], key: CountyKey, lang: "en" | "es"): string {
  const c = findCounty(counties, key);
  if (!c) return "";
  return lang === "en" ? c.name.en : c.name.es.charAt(0).toLowerCase() + c.name.es.slice(1);
}
