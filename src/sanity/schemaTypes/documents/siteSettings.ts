import { defineArrayMember, defineField, defineType } from "sanity";

const DAYS = [
  { title: "Lunes", value: "Monday" },
  { title: "Martes", value: "Tuesday" },
  { title: "Miércoles", value: "Wednesday" },
  { title: "Jueves", value: "Thursday" },
  { title: "Viernes", value: "Friday" },
  { title: "Sábado", value: "Saturday" },
  { title: "Domingo", value: "Sunday" },
];

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * CONFIGURACIÓN GENERAL (documento único).
 * Logos, contacto, horario, registro de contratista y redes: lo que se cambia con más frecuencia.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configuración general",
  type: "document",
  groups: [
    { name: "brand", title: "Marca y logos", default: true },
    { name: "contact", title: "Contacto" },
    { name: "hours", title: "Horario y área" },
    { name: "legal", title: "Legal" },
    { name: "social", title: "Redes y reseñas" },
    { name: "assistant", title: "Asistente de IA" },
  ],
  fields: [
    // ---------- Marca ----------
    defineField({
      name: "legalName",
      title: "Nombre legal de la empresa",
      type: "string",
      group: "brand",
      description: 'Ejemplo: "ECG Construction LLC". Se usa en el footer, títulos y datos para Google.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name",
      title: "Nombre corto",
      type: "string",
      group: "brand",
      description: 'Ejemplo: "ECG Construction".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slogan",
      title: "Eslogan",
      type: "string",
      group: "brand",
      description: 'Ejemplo: "Built on Experience. Driven by Quality."',
    }),
    defineField({
      name: "tagline",
      title: "Frase de presentación",
      type: "string",
      group: "brand",
      description: 'Ejemplo: "Quality Workmanship. Reliable Service. Professional Results." (página Nosotros).',
    }),
    defineField({
      name: "logo",
      title: "Logo horizontal (header y footer)",
      type: "image",
      group: "brand",
      description:
        "Sube un PNG o SVG con fondo transparente y letras claras (el sitio es oscuro). Tamaño recomendado: 620 × 172 px. Si lo dejas vacío se usa el logo dibujado en el código.",
      options: { accept: "image/png,image/svg+xml,image/webp" },
    }),
    defineField({
      name: "logoSquare",
      title: "Logo cuadrado",
      type: "image",
      group: "brand",
      description: "Versión cuadrada (600 × 600 px) para Google y los datos estructurados.",
    }),
    defineField({
      name: "ogImage",
      title: "Imagen para compartir en redes",
      type: "image",
      group: "brand",
      description: "Aparece al compartir la web en WhatsApp, Facebook, etc. Tamaño: 1200 × 630 px (JPG).",
    }),

    // ---------- Contacto ----------
    defineField({
      name: "contactName",
      title: "Persona de contacto",
      type: "string",
      group: "contact",
      description: 'Ejemplo: "Manny Cobian".',
    }),
    defineField({
      name: "phoneDisplay",
      title: "Teléfono (como se muestra)",
      type: "string",
      group: "contact",
      description: 'Ejemplo: "425.200.7230".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "phoneE164",
      title: "Teléfono para llamar (formato internacional)",
      type: "string",
      group: "contact",
      description: 'Solo "+1" y números, sin espacios. Ejemplo: "+14252007230". Se usa en el botón de llamada.',
      validation: (r) => r.required().regex(/^\+\d{8,15}$/, { name: "E.164" }),
    }),
    defineField({
      name: "email",
      title: "Correo",
      type: "string",
      group: "contact",
      description: 'Ejemplo: "ecgconstructionwa@gmail.com".',
      validation: (r) => r.required().email(),
    }),

    // ---------- Horario y área ----------
    defineField({
      name: "hours",
      title: "Horario de atención (para Google)",
      type: "object",
      group: "hours",
      description: "Datos estructurados del horario. El texto visible se edita abajo.",
      fields: [
        defineField({
          name: "days",
          title: "Días",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
          options: { list: DAYS, layout: "grid" },
          description: "Ejemplo: lunes a viernes.",
        }),
        defineField({
          name: "opens",
          title: "Abre (HH:MM, 24 h)",
          type: "string",
          description: 'Ejemplo: "09:00".',
          validation: (r) => r.required().regex(TIME, { name: "HH:MM" }),
        }),
        defineField({
          name: "closes",
          title: "Cierra (HH:MM, 24 h)",
          type: "string",
          description: 'Ejemplo: "17:00".',
          validation: (r) => r.required().regex(TIME, { name: "HH:MM" }),
        }),
      ],
    }),
    defineField({
      name: "hoursText",
      title: "Horario (texto completo)",
      type: "localeString",
      group: "hours",
      description: 'Ejemplo: "Monday – Friday · 9:00 AM – 5:00 PM (Pacific Time)" / "Lunes a viernes · 9:00 a. m. – 5:00 p. m. (hora del Pacífico)".',
    }),
    defineField({
      name: "hoursShort",
      title: "Horario (texto corto, footer)",
      type: "localeString",
      group: "hours",
      description: 'Ejemplo: "Mon–Fri 9:00 AM – 5:00 PM" / "Lun–Vie 9:00 a. m. – 5:00 p. m."',
    }),
    defineField({
      name: "weekendText",
      title: "Fines de semana",
      type: "localeString",
      group: "hours",
      description: 'Ejemplo: "Saturday & Sunday: closed (call to schedule)".',
    }),
    defineField({
      name: "serviceAreaText",
      title: "Área de servicio (texto)",
      type: "localeString",
      group: "hours",
      description: 'Ejemplo: "Snohomish County, Skagit County & North King County, WA".',
    }),
    defineField({
      name: "mapQuery",
      title: "Centro del mapa general",
      type: "string",
      group: "hours",
      description: 'Lugar que se busca en Google Maps. Ejemplo: "Arlington, WA".',
    }),

    // ---------- Legal ----------
    defineField({
      name: "contractorLicense",
      title: "Registro de contratista WA (L&I)",
      type: "string",
      group: "legal",
      description:
        'OBLIGATORIO por ley en Washington. Solo el número, ej. "ECGCOCL749K2". Se muestra como "WA Contractor Reg # …" en el footer de todas las páginas.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "yearsExperience",
      title: "Años de experiencia",
      type: "number",
      group: "legal",
      description: "Ejemplo: 20. Disponible en los textos como {years}.",
      validation: (r) => r.required().min(0).integer(),
    }),

    // ---------- Reseñas ----------
    defineField({
      name: "googleReviewUrl",
      title: "Enlace para dejar reseña en Google",
      type: "url",
      group: "social",
      description:
        'Enlace de Google Business Profile para escribir una reseña (en Google Business → "Pedir reseñas" → copiar enlace). Ejemplo: "https://g.page/r/XXXX/review". Si está lleno, aparece el botón "Déjanos tu reseña".',
      validation: (r) => r.uri({ scheme: ["https"] }),
    }),

    // ---------- Asistente de IA ----------
    defineField({
      name: "assistantEnabled",
      title: "Mostrar el asistente de IA en la web",
      type: "boolean",
      group: "assistant",
      initialValue: true,
      description:
        "Burbuja de chat que responde preguntas de los visitantes y registra solicitudes de cotización (aparecen en \"Solicitudes de cotización\"). Desactívalo para ocultarlo.",
    }),

    // ---------- Redes ----------
    defineField({
      name: "social",
      title: "Redes sociales",
      type: "array",
      group: "social",
      description: "Perfiles de la empresa (se agregan a los datos para Google).",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Red",
              type: "string",
              options: {
                list: ["Facebook", "Instagram", "Google Business Profile", "Yelp", "Nextdoor", "LinkedIn", "TikTok", "YouTube"],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "url",
              title: "Enlace del perfil",
              type: "url",
              description: 'Ejemplo: "https://www.facebook.com/ecgconstruction".',
              validation: (r) => r.required().uri({ scheme: ["https"] }),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Configuración general" }) },
});
