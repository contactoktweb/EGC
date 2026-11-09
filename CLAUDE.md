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
  (RCW 18.27.100). Valor en `src/lib/site.ts` (`contractorLicense` / `contractorRegText`).
- No usar "Licensed, Bonded & Insured" ni "Con licencia, fianza y seguro". Usar
  "Licensed WA General Contractor – Reg # ECGCOCL749K2" / "Contratista general con licencia en WA – Reg # ECGCOCL749K2".

## Proyecto

- Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS 4. Leer `AGENTS.md` y
  `node_modules/next/dist/docs/` antes de escribir código de Next.js.
- Sitio bilingüe: rutas `/en/...` y `/es/...` bajo `src/app/[lang]/`; redirección por idioma en `src/proxy.ts`.
- Contenido editable en `src/content/` (textos EN/ES, servicios, ciudades, proyectos, FAQ, fotos).
- Datos del negocio (nombre, teléfono, correo, horario, área) solo en `src/lib/site.ts`.
  Correo: ecgconstructionwa@gmail.com · Horario: lunes a viernes, 9:00 a. m. – 5:00 p. m.
  Área: condado de Snohomish, condado de Skagit y el norte del condado de King (sin Bellevue, Redmond ni Seattle).
- SEO/GEO: metadata y JSON-LD en `src/lib/seo.ts`; `sitemap.ts`, `robots.ts`, `llms.txt/route.ts`.
- Usar siempre el nombre **ECG** Construction LLC (no "EGC").
- Formulario de contacto: el envío con Resend está pendiente (`src/app/api/contact/route.ts`).
- Comprobar con `npm run build` y `npm run lint` antes de hacer commit.
