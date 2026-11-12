@AGENTS.md

# ECG Construction LLC — instrucciones del proyecto

## OBLIGATORIO: crédito del desarrollador en el footer

El footer de **todas** las páginas debe mostrar siempre, sin excepción:

- El texto **"Desarrollado por K&T"** seguido de un **corazón** (♥).
- Un enlace a **https://kytcode.lat** (se abre en una pestaña nueva, `target="_blank" rel="noopener"`).

Implementación actual: `src/components/Footer.tsx` (franja inferior, marcada con el comentario
`OBLIGATORIO: crédito del desarrollador`).

Reglas:
- No eliminar, ocultar, traducir a otro texto ni mover fuera del footer este crédito.
- Si se rediseña o reemplaza el footer, o se crea un layout nuevo, el crédito debe incluirse igual.
- Antes de cada commit, verificar que el crédito sigue visible en `/en` y `/es`.

## OBLIGATORIO: registro de contratista L&I (ley de Washington)

- El footer de todas las páginas (inglés y español) debe mostrar **"WA Contractor Reg # ECGCOCL749K2"**
  (RCW 18.27.100). Valor en Configuración general (`contractorLicense`); se renderiza con `contractorRegText()`.
- No usar "Licensed, Bonded & Insured" ni "Con licencia, fianza y seguro". Usar
  "Licensed WA General Contractor – Reg # ECGCOCL749K2" / "Contratista general con licencia en WA – Reg # ECGCOCL749K2".

## Proyecto

- Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4. Leer `AGENTS.md` y
  `node_modules/next/dist/docs/` antes de escribir código de Next.js.
- Sitio bilingüe: rutas `/en/...` y `/es/...` bajo `src/app/[lang]/`; redirección por idioma en `src/proxy.ts`.
- **Contenido desde Sanity** (ver `docs/SANITY.md`). Los componentes NUNCA importan `src/content/*`
  directamente: usan `getContent()` / `getPageContent(lang)` de `src/lib/content`.
  `src/content/` es solo respaldo (si Sanity no responde o falta un campo). El contenido ya está
  cargado en Sanity (proyecto `rflzedcs`, dataset `production`) y se edita en `/admin`.
- Esquemas de Sanity: sin campos de clases/estilos ni URLs de imágenes; imágenes y videos se suben
  como archivos. Todo texto visible es bilingüe ({ en, es }) y cada campo lleva un ejemplo.
- **Políticas (privacidad, términos, etc.): SIEMPRE con editor WYSIWYG** — tipo `localeRichText`
  (Portable Text) en el esquema y renderizado con `src/components/RichText.tsx`. Nunca listas de
  párrafos o campos sueltos.
- Al agregar contenido nuevo: actualizar el esquema, `src/lib/content/sanity.ts` y el respaldo en
  `src/content/`; luego cargar el contenido real desde `/admin`.
- Datos del negocio (nombre, teléfono, correo, horario, área, registro): "Configuración general"
  en Sanity; respaldo en `src/content/settings.ts`. `src/lib/site.ts` solo tiene la URL pública.
  Correo: ecgconstructionwa@gmail.com · Horario: lunes a viernes, 9:00 a. m. – 5:00 p. m.
  Área: condado de Snohomish, condado de Skagit y el norte del condado de King (sin Bellevue, Redmond ni Seattle).
- SEO/GEO: metadata y JSON-LD en `src/lib/seo.ts`; `sitemap.ts`, `robots.ts`, `llms.txt/route.ts`.
- Usar siempre el nombre **ECG** Construction LLC (no "EGC").
- Formulario (con fotos) y asistente de IA usan `submitLead()` (`src/lib/leads.ts`): guardan la solicitud en
  Sanity → "Solicitudes de cotización" (`SANITY_API_WRITE_TOKEN`) y envían todos los correos con Resend
  (`src/lib/email.ts`, `RESEND_API_KEY`): aviso al equipo + confirmación al cliente. Remitente
  `info@ecgcowa.com`; el destinatario se edita en Sanity (Configuración general → Notificaciones,
  por defecto ecgconstructionwa@gmail.com). Todo dato del cliente en un correo va escapado con `esc()`.
- Asistente de IA: `src/app/api/assistant/route.ts` + `src/lib/assistant.ts` (SDK oficial `@anthropic-ai/sdk`,
  modelo `claude-opus-5-5`, effort `low`, `fallbacks: "default"`). Requiere `ANTHROPIC_API_KEY`; se apaga en
  Configuración general. Sus instrucciones se arman con el contenido de Sanity (no duplicar datos en el prompt).
- Reseñas: solo reales (Sanity → Reseñas); nunca inventar reseñas ni usar `AggregateRating` con reseñas propias.
  Los clientes pueden dejarlas en la web (`/api/reviews`): entran como `status: "pending"` y solo se muestran
  las `approved` (o sin estado, las antiguas). El equipo también puede agregarlas a mano en el panel.
- Comprobar con `npm run build` y `npm run lint` antes de hacer commit.
