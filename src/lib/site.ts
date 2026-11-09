/**
 * URL pública del sitio (canonical, sitemap, hreflang, Open Graph).
 * El resto de datos del negocio (teléfono, correo, horario, registro…) vive en
 * "Configuración general" de Sanity, o en src/content/settings.ts como respaldo.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const site = { url: resolveSiteUrl() } as const;
