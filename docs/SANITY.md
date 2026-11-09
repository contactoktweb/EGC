# Sanity CMS — guía completa

La web lee **todo su contenido desde Sanity**: textos en inglés y español, servicios, condados,
ciudades, galería de proyectos (fotos y videos), preguntas frecuentes, política de privacidad y la
**Configuración general** (logos, contacto, horario, registro de contratista, redes).

Mientras no haya claves, la web usa el contenido de respaldo de `src/content/` y funciona igual.

---

## 1. Puesta en marcha (solo poner las claves)

1. Crea un proyecto gratis en <https://www.sanity.io/manage> → **Create project**.
   Copia el **Project ID** (8 caracteres, p. ej. `a1b2c3d4`). Dataset: `production`.
2. En el proyecto → **API → Tokens → Add API token**: nombre "seed", permiso **Editor**. Copia el token.
3. En el proyecto → **API → CORS origins → Add CORS origin**:
   - `http://localhost:3000` (marca *Allow credentials*)
   - `https://ecgconstructionwa.com` (o tu dominio; marca *Allow credentials*)
4. Copia `.env.example` como `.env.local` y completa:

   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=a1b2c3d4
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=sk...
   SANITY_REVALIDATE_SECRET=un-texto-largo-y-aleatorio
   ```

5. Sube todo el contenido actual a Sanity:

   ```bash
   npm run sanity:seed
   ```

   Primero puedes simular sin escribir nada: `npm run sanity:seed -- --dry-run`.

6. Listo: `npm run dev` y abre <http://localhost:3000/studio> para editar.
   La web ya muestra la información de Sanity.

7. En **Vercel** agrega las mismas variables (Project → Settings → Environment Variables) y
   vuelve a desplegar. `SANITY_API_WRITE_TOKEN` no es necesario en Vercel.

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

## 2. Qué hay en el Studio (`/studio`)

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
| **Política de privacidad** | único | Página `/privacy` |

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
| Descripción | EN `Stamped concrete patio with curved decorative border` / ES `Patio de concreto estampado con borde curvo` |
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

## 4. Scripts

| Comando | Para qué |
|---|---|
| `npm run sanity:seed` | Sube/actualiza todo el contenido y las fotos de `src/content` a Sanity |
| `npm run sanity:seed -- --dry-run` | Simula la subida sin escribir nada |
| `npm run sanity:seed -- --prune` | Además borra servicios/ciudades/proyectos que ya no estén en `src/content` |
| `npm run sanity:check` | Prueba sin conexión: lo subido, leído por la web, es idéntico al contenido actual |
| `npm run sanity:studio` | Abre el Studio aparte (requiere `SANITY_STUDIO_PROJECT_ID`) |

> ⚠️ `sanity:seed` **sobrescribe** los documentos que sube. Úsalo para la carga inicial o para
> restaurar; después edita en el Studio.

Videos para el seed: colócalos en `public/videos/` y en `src/content/projects.ts` agrega
`video: "nombre.mp4"` al proyecto (la foto del proyecto se usa como portada).

---

## 5. Cómo está construido (para desarrolladores)

```
sanity.config.ts            Studio (integrado en /studio y para `sanity dev`)
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
src/app/studio/             Ruta del Studio
src/app/api/revalidate/     Webhook → revalidateTag("sanity")
scripts/seed-sanity.ts      Subida completa
scripts/check-sanity-roundtrip.ts  Prueba de ida y vuelta
```

- Para agregar un texto nuevo: agrégalo en `src/content/dictionary.ts` (EN y ES) y su título en
  `FIELD_TITLES` de `src/sanity/dictionary-map.ts`. El campo aparece solo en el Studio.
- Si falta algún documento en Sanity, esa parte usa el respaldo (la web nunca queda en blanco).
