# ECG Construction LLC — Sitio web

Sitio bilingüe (inglés / español) de **ECG Construction LLC**, empresa de construcción en los condados de
Snohomish y Skagit y el norte del condado de King, Washington. Construido con **Next.js 16 (App Router)**, **React 19** y **Tailwind CSS 4**,
inspirado en la estructura por bloques de una plantilla de construcción y con la identidad visual del logo
(carbón `#1B1A1B`, verde `#5F9A4F`, blanco).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000  → redirige a /en o /es según el navegador
npm run build    # build de producción (todas las páginas se prerenderizan)
npm run lint
```

Copia `.env.example` a `.env.local` y define al menos `NEXT_PUBLIC_SITE_URL` antes de publicar.

## Estructura

```
src/
  app/
    [lang]/                  # layout raíz por idioma (en | es)
      page.tsx               # Inicio: 12 bloques
      services/              # índice + /services/[slug] (7 servicios)
      projects/              # galería filtrable (vaciado, pulido, epoxy)
      about/  contact/
      service-areas/         # índice + /service-areas/[city] (12 ciudades)
      not-found.tsx
    api/contact/route.ts     # formulario (Resend pendiente)
    sitemap.ts  robots.ts  llms.txt/route.ts
    icon.svg  apple-icon.png  favicon.ico
  proxy.ts                   # redirección por idioma (Accept-Language)
  components/                # Header, Footer, Logo, secciones
  content/                   # textos EN/ES, servicios, ciudades, proyectos, FAQ, fotos
  lib/                       # datos del negocio (site.ts), i18n, SEO / JSON-LD
```

Todo el contenido editable vive en `src/content/` y los datos de contacto y horario en `src/lib/site.ts`.

## SEO

- URLs por idioma (`/en/...`, `/es/...`) con `hreflang` (en-US, es-US, x-default) y canonical.
- Metadata y Open Graph por página; imagen OG en `public/og-image.jpg`.
- `sitemap.xml` con alternativas de idioma y `robots.txt`.
- Datos estructurados: `GeneralContractor`/`HomeAndConstructionBusiness` (horario, área de servicio,
  contacto, catálogo de servicios), `Service`, `FAQPage`, `BreadcrumbList` y `WebSite`.
- Páginas locales por ciudad y por servicio, con enlaces internos.
- Imágenes optimizadas con `next/image` (AVIF/WebP, blur placeholder) y nombres de archivo descriptivos.
- Todas las páginas se prerenderizan como estáticas.

## GEO (motores de IA)

- `/llms.txt` con el resumen de la empresa, servicios, áreas y preguntas frecuentes.
- Cada servicio abre con un párrafo de respuesta directa (quién, qué, dónde).
- Preguntas frecuentes visibles + schema `FAQPage`.
- Nombre, teléfono y área (NAP) centralizados en `src/lib/site.ts` para que sean idénticos en todo el sitio.

## Horario

Lunes a viernes, 9:00 a. m. – 5:00 p. m., hora del Pacífico.
Se edita en `src/lib/site.ts` y en los textos de `src/content/dictionary.ts`.

## Pendientes

- [ ] **Resend**: conectar el envío de correos en `src/app/api/contact/route.ts` (instrucciones en el archivo).
  Mientras tanto el formulario responde con el teléfono y el correo como alternativa.
- [ ] Definir el dominio en `NEXT_PUBLIC_SITE_URL`.
- [ ] Crear/verificar el perfil de Google Business Profile con los mismos datos (NAP).
