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

## Contenido: Sanity CMS

Todo el contenido (textos EN/ES, servicios, áreas, galería con fotos/videos, FAQ, privacidad y la
**Configuración general** con logos y datos de contacto) se edita en Sanity, en `/studio`.

1. Pon las claves de Sanity en `.env.local` (ver `.env.example`).
2. `npm run sanity:seed` sube todo el contenido actual y las fotos.
3. Desde ese momento la web lee todo desde Sanity.

Guía completa con ejemplos de cada campo: **[docs/SANITY.md](docs/SANITY.md)**.
Sin claves, la web usa el respaldo de `src/content/`.

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
  lib/                       # capa de contenido (Sanity / respaldo), i18n, SEO / JSON-LD
  sanity/                    # esquemas y configuración del Studio (ver docs/SANITY.md)
```

El contenido se edita en Sanity. `src/content/` es el respaldo y la fuente del script de subida;
la configuración general de respaldo está en `src/content/settings.ts`.

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
- Nombre, teléfono y área (NAP) centralizados en "Configuración general" (Sanity) para que sean idénticos en todo el sitio.

## Horario

Lunes a viernes, 9:00 a. m. – 5:00 p. m., hora del Pacífico.
Se edita en Sanity → Configuración general.

## Pendientes

- [ ] **Resend**: conectar el envío de correos en `src/app/api/contact/route.ts` (instrucciones en el archivo).
  Mientras tanto el formulario responde con el teléfono y el correo como alternativa.
- [ ] Definir el dominio en `NEXT_PUBLIC_SITE_URL`.
- [ ] Crear/verificar el perfil de Google Business Profile con los mismos datos (NAP).
