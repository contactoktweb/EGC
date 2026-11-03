/**
 * Datos centrales de la empresa (NAP: Name, Address/Area, Phone).
 * Mantenerlos en un solo lugar garantiza consistencia para SEO local y GEO.
 */

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = {
  url: resolveSiteUrl(),
  legalName: "ECG Construction LLC",
  name: "ECG Construction",
  slogan: "Built on Experience. Driven by Quality.",
  tagline: "Quality Workmanship. Reliable Service. Professional Results.",
  contactName: "Manny Cobian",
  phoneDisplay: "425.200.7230",
  phoneE164: "+14252007230",
  email: "Mane18882@gmail.com",
  region: "WA",
  regionName: "Washington",
  country: "US",
  yearsExperience: 20,
  /**
   * Horario laboral estándar en EE. UU.: lunes a viernes, 8:00 a.m. – 5:00 p.m.
   * Zona horaria del Pacífico (Washington State).
   */
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
    opens: "08:00",
    closes: "17:00",
    timeZone: "America/Los_Angeles",
  },
  counties: ["Snohomish County", "King County"],
  /**
   * Número de registro de contratista de Washington L&I.
   * La ley de WA (RCW 18.27.100) exige mostrarlo en la publicidad: complétalo cuando lo tengas.
   */
  contractorLicense: process.env.NEXT_PUBLIC_WA_CONTRACTOR_LICENSE ?? "",
} as const;

export const telHref = `tel:${site.phoneE164}`;
export const mailHref = `mailto:${site.email}`;
