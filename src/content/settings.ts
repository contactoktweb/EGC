import type { Settings } from "@/lib/content/types";

/**
 * "Configuración general" de respaldo (solo se usa si Sanity no está configurado).
 * El contenido real se edita en Sanity → /admin → Configuración general.
 * Las imágenes se indican por nombre de archivo dentro de src/content/images.
 */
export type SettingsSource = Omit<Settings, "logo" | "logoSquare" | "ogImage"> & {
  logo: string | null;
  logoSquare: string | null;
  ogImage: string | null;
};

export const settingsData: SettingsSource = {
  legalName: "ECG Construction LLC",
  name: "ECG Construction",
  slogan: "Built on Experience. Driven by Quality.",
  tagline: "Quality Workmanship. Reliable Service. Professional Results.",
  contactName: "Manny Cobian",
  phoneDisplay: "425.200.7230",
  phoneE164: "+14252007230",
  email: "ecgconstructionwa@gmail.com",
  // OBLIGATORIO por ley en WA (RCW 18.27.100): se muestra en el footer de todas las páginas.
  contractorLicense: "ECGCOCL749K2",
  yearsExperience: 20,
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  hoursText: {
    en: "Monday – Friday · 9:00 AM – 5:00 PM (Pacific Time)",
    es: "Lunes a viernes · 9:00 a. m. – 5:00 p. m. (hora del Pacífico)",
  },
  hoursShort: { en: "Mon–Fri 9:00 AM – 5:00 PM", es: "Lun–Vie 9:00 a. m. – 5:00 p. m." },
  weekendText: {
    en: "Saturday & Sunday: closed (call to schedule)",
    es: "Sábado y domingo: cerrado (llámanos para agendar)",
  },
  serviceAreaText: {
    en: "Snohomish County, Skagit County & North King County, WA",
    es: "Condados de Snohomish y Skagit y el norte del condado de King, WA",
  },
  mapQuery: "Arlington, WA",
  logo: "brand/logo-horizontal.png",
  logoSquare: "brand/logo-square.png",
  ogImage: "brand/og-image.jpg",
  social: [],
  googleReviewUrl: "",
  assistantEnabled: true,
};
