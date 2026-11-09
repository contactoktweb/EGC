/**
 * Claves de Sanity. Es lo único que hay que completar (en .env.local o en Vercel):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID   → ID del proyecto (sanity.io/manage)
 *   NEXT_PUBLIC_SANITY_DATASET      → normalmente "production"
 * Opcionales:
 *   SANITY_API_READ_TOKEN           → solo si el dataset es privado
 *   SANITY_API_WRITE_TOKEN          → para el script de subida (npm run sanity:seed)
 *   SANITY_REVALIDATE_SECRET        → secreto del webhook que actualiza la web al publicar
 *
 * Sin projectId la web usa el contenido de respaldo de src/content (no falla el build).
 */
// SANITY_STUDIO_* solo se usa al abrir el Studio aparte con `npm run sanity:studio`.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-11-01";

export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
