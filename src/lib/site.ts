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
  email: "ecgconstructionwa@gmail.com",
  region: "WA",
  regionName: "Washington",
  country: "US",
  yearsExperience: 20,
  /**
   * Horario de atención: lunes a viernes, 9:00 a. m. – 5:00 p. m.
   * Zona horaria del Pacífico (Washington State).
   */
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
    opens: "09:00",
    closes: "17:00",
    timeZone: "America/Los_Angeles",
  },
  /** Área de servicio: condado de Snohomish, condado de Skagit y el norte del condado de King. */
  counties: ["Snohomish County", "Skagit County", "North King County"],
  /**
   * Número de registro de contratista de Washington L&I.
   * OBLIGATORIO por ley (RCW 18.27.100): debe aparecer en el footer de todas las páginas.
   */
  contractorLicense: "ECGCOCL749K2",
} as const;

/** Texto obligatorio del registro L&I (igual en inglés y español). */
export const contractorRegText = `WA Contractor Reg # ${site.contractorLicense}`;

export const telHref = `tel:${site.phoneE164}`;
export const mailHref = `mailto:${site.email}`;
