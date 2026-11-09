# Sanity CMS — guía completa

La web lee **todo su contenido desde Sanity**: textos en inglés y español, servicios, condados,
ciudades, galería de proyectos (fotos y videos), preguntas frecuentes, política de privacidad y la
**Configuración general** (logos, contacto, horario, registro de contratista, redes).

Mientras no haya claves, la web usa el contenido de respaldo de `src/content/` y funciona igual.

---

## 1. Estado actual

- Proyecto **`rflzedcs`**, dataset **`production`**. Todo el contenido y las fotos ya están cargados.
- Panel de edición: **`/admin`** (p. ej. `https://ecgconstructionwa.com/admin`).
- Variables en Vercel: `NEXT_PUBLIC_SANITY_PROJECT_ID=rflzedcs`, `NEXT_PUBLIC_SANITY_DATASET=production`
  y `SANITY_REVALIDATE_SECRET` (el mismo secreto del webhook).
- Para entrar a `/admin` desde un dominio nuevo, agrégalo en sanity.io/manage → **API → CORS origins**
  con *Allow credentials*.
- En local: copia `.env.example` como `.env.local` con el Project ID y el dataset.

### Actualización automática al publicar (webhook)

En sanity.io/manage → **API → Webhooks → Create webhook**:

| Campo | Valor |
|---|---|
| URL | `https://ecgconstructionwa.com/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| HTTP method | POST |
| Secret | el mismo valor de `SANITY_REVALIDATE_SECRET` |

Con el webhook, cada cambio publicado aparece en la web en segundos. Sin él, se actualiza solo cada hora.

---

## 2. Qué hay en el Studio (`/admin`)

| Sección | Tipo | Qué se edita |
|---|---|---|
| **Configuración general** | único | Logos, nombre, eslogan, teléfono, correo, horario, área, registro L&I, redes sociales |
| **Página de inicio** | único | Imagen de portada, imagen de "Sobre nosotros" y los textos de cada sección |
| **Textos generales** | único | Menú, botones, formulario, títulos y descripciones SEO de cada página |
| **Servicios** | lista | Los 7 servicios (cada uno con su página `/services/[slug]`) |
| **Proyectos (galería)** | lista | Fotos o videos de trabajos, con su categoría |
| **Preguntas frecuentes** | lista | Preguntas generales (inicio, Google y asistentes de IA) |
| **Condados** | lista | Snohomish, Skagit, norte de King (página `/service-areas/[slug]`) |
| **Ciudades** | lista | Cada ciudad con su página `/service-areas/[slug]` |
| **Política de privacidad** | único | Página `/privacy`, con editor visual (WYSIWYG) |

Reglas del modelo:

- **Todos los textos visibles son bilingües**: campo *English* (obligatorio) y *Español*.
  Si el español queda vacío, la web muestra el inglés.
- **Imágenes y videos se suben como archivos** (no se escriben URLs). Sanity las optimiza y la
  web las sirve en el tamaño y formato adecuados (WebP/AVIF). Usa el *punto de enfoque* para
  elegir qué parte de la foto se ve.
- No hay campos de estilos ni de "clases": el diseño vive en el código.
- Cada campo tiene una descripción con un **ejemplo** del valor esperado.

### Variables dentro de los textos

En cualquier texto puedes escribir estas variables y la web las reemplaza con la
**Configuración general**:

| Variable | Se convierte en |
|---|---|
| `{phone}` | 425.200.7230 |
| `{email}` | ecgconstructionwa@gmail.com |
| `{license}` | ECGCOCL749K2 |
| `{years}` | 20 |

Ejemplo: `Call {phone} — Monday to Friday` → "Call 425.200.7230 — Monday to Friday".
Así, si cambia el teléfono, se cambia **una sola vez** en Configuración general.

---

## 3. Ejemplos de cada documento

### Configuración general

| Campo | Ejemplo |
|---|---|
| Nombre legal | `ECG Construction LLC` |
| Nombre corto | `ECG Construction` |
| Eslogan | `Built on Experience. Driven by Quality.` |
| Logo horizontal | PNG/SVG transparente, letras claras, 620 × 172 px |
| Logo cuadrado | PNG 600 × 600 px |
| Imagen para redes | JPG 1200 × 630 px |
| Teléfono (como se muestra) | `425.200.7230` |
| Teléfono para llamar | `+14252007230` |
| Correo | `ecgconstructionwa@gmail.com` |
| Horario (Google) | Lunes–Viernes, abre `09:00`, cierra `17:00` |
| Horario (texto) | EN `Monday – Friday · 9:00 AM – 5:00 PM (Pacific Time)` / ES `Lunes a viernes · 9:00 a. m. – 5:00 p. m. (hora del Pacífico)` |
| Área (texto) | EN `Snohomish County, Skagit County & North King County, WA` |
| Centro del mapa | `Arlington, WA` |
| Registro WA (L&I) | `ECGCOCL749K2` → se muestra "WA Contractor Reg # ECGCOCL749K2" en el footer (obligatorio por ley) |
| Años de experiencia | `20` |
| Redes | Facebook → `https://www.facebook.com/...` |

### Servicio

| Campo | Ejemplo |
|---|---|
| Nombre | EN `Epoxy & Protective Floor Coatings` / ES `Epoxy y recubrimientos protectores para pisos` |
| URL (slug) | `epoxy-floor-coatings` |
| Orden | `3` |
| Icono | Epoxy (capas) |
| Nombre destacado | EN `Epoxy Work` / ES `Trabajos en epoxy` (solo los 3 destacados) |
| Resumen corto | `Garage epoxy, decorative flake and metallic epoxy, commercial coatings…` |
| Introducción | `ECG Construction installs epoxy and protective floor coatings in garages, shops…` |
| Sub-servicios | `Garage epoxy flooring`, `Decorative flake epoxy systems`, … |
| Imagen + texto alternativo | foto del piso + `Garage floor with decorative flake epoxy system` |
| Categoría de fotos | Epoxy |
| Preguntas frecuentes | "How long does a garage epoxy floor take to install?" + respuesta |
| Relacionados | Preparación y acabado de pisos, Construcción de concreto |

### Proyecto (galería)

| Campo | Ejemplo |
|---|---|
| Categoría | Vaciado de concreto · Concreto pulido · Epoxy |
| Foto | foto del trabajo terminado (o portada del video) |
| Video (opcional) | MP4 < 50 MB, 15–60 s |
| Descripción | EN `Stamped concrete patio with stone pattern` / ES `Patio de concreto estampado con patrón de piedra` |
| Orden | `1` (los primeros 12 salen en el inicio) |

### Condado / Ciudad

| Campo | Ejemplo condado | Ejemplo ciudad |
|---|---|---|
| Nombre | EN `Skagit County` / ES `Condado de Skagit` | `Mount Vernon` |
| URL (slug) | `skagit` | `mount-vernon` |
| Nombre para Google | `Skagit County, Washington` | — |
| Búsqueda del mapa | `Skagit County, WA` | — |
| Condado | — | Skagit County |
| Descripción | contexto local en 2–3 frases | `Mount Vernon is the Skagit County seat; …` |
| Ciudades cercanas | — | Burlington, Sedro-Woolley, Anacortes |

### Pregunta frecuente

| Campo | Ejemplo |
|---|---|
| Pregunta | EN `What are your business hours?` / ES `¿Cuál es su horario de atención?` |
| Respuesta | EN `Monday through Friday, 9:00 AM to 5:00 PM Pacific Time.` |
| Orden | `4` |

---

## 4. Editar la política de privacidad (editor visual)

En `/admin` → **Política de privacidad** → campo **Contenido** (pestañas English / Español). Se edita
como en un procesador de textos:

- **Título de sección** para cada apartado ("Information we collect"…), **Párrafo** para el texto.
- Botones de **viñetas** o lista **numerada**, **negrita**, *cursiva* y **enlace** (ej. `mailto:{email}`,
  `https://adssettings.google.com`; marca "Abrir en una pestaña nueva" para sitios externos).
- Puedes usar `{phone}`, `{email}` y `{license}`; actualiza también la **Fecha de actualización**.

Toda política nueva (términos, cookies…) debe usar este mismo editor.

## 5. Agregar videos a la galería

En `/admin` → **Proyectos (galería)** → crear proyecto: sube la foto de portada y el video (MP4,
menos de 50 MB, 15–60 s), elige la categoría y escribe la descripción en inglés y español.

## 6. Cómo está construido (para desarrolladores)

```
sanity.config.ts            Studio (integrado en /admin y para `sanity dev`)
sanity.cli.ts               Config de la CLI
src/sanity/
  env.ts                    Claves (projectId, dataset, apiVersion)
  client.ts                 Cliente de lectura
  structure.ts              Menú del Studio (documentos únicos + listas)
  dictionary-map.ts         Mapa diccionario ↔ Sanity (títulos en español, pares, exclusiones)
  schemaTypes/              Esquemas (objetos bilingües + documentos)
src/lib/content/
  index.ts                  getContent(): Sanity si hay claves, si no respaldo (cacheado, tag "sanity")
  sanity.ts                 Consulta GROQ única + conversión al formato de la web
  static.ts                 Respaldo desde src/content
  finalize.ts               Variables {phone}/{email}/{license}/{years} y textos de horario
  types.ts                  Tipos compartidos
src/app/admin/              Ruta del Studio
src/app/api/revalidate/     Webhook → revalidateTag("sanity")
src/components/RichText.tsx Render del texto del editor visual (políticas)
```

- Para agregar un texto nuevo: agrégalo en `src/content/dictionary.ts` (EN y ES) y su título en
  `FIELD_TITLES` de `src/sanity/dictionary-map.ts`. El campo aparece solo en el Studio.
- Si falta algún documento en Sanity, esa parte usa el respaldo (la web nunca queda en blanco).
