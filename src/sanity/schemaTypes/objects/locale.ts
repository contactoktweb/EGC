import { defineField, defineType } from "sanity";

/**
 * Tipos bilingües reutilizables. Todo texto visible de la web se guarda como { en, es }.
 * Inglés es obligatorio (idioma principal); si falta el español, la web muestra el inglés.
 */

export const localeString = defineType({
  name: "localeString",
  title: "Texto corto (EN / ES)",
  type: "object",
  options: { columns: 2 },
  fields: [
    defineField({ name: "en", title: "English", type: "string", validation: (r) => r.required() }),
    defineField({ name: "es", title: "Español", type: "string" }),
  ],
});

export const localeText = defineType({
  name: "localeText",
  title: "Texto largo (EN / ES)",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "es", title: "Español", type: "text", rows: 3 }),
  ],
});

export const localeStringList = defineType({
  name: "localeStringList",
  title: "Lista de textos (EN / ES)",
  type: "object",
  description: "Una línea por elemento. Mantén el mismo orden y cantidad en ambos idiomas.",
  fields: [
    defineField({ name: "en", title: "English", type: "array", of: [{ type: "string" }], validation: (r) => r.required().min(1) }),
    defineField({ name: "es", title: "Español", type: "array", of: [{ type: "string" }] }),
  ],
});

export const localeTextList = defineType({
  name: "localeTextList",
  title: "Lista de párrafos (EN / ES)",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "array", of: [{ type: "text", rows: 3 }] }),
    defineField({ name: "es", title: "Español", type: "array", of: [{ type: "text", rows: 3 }] }),
  ],
});

/** Pregunta frecuente (se usa en servicios y en "Preguntas frecuentes"). */
export const faqItem = defineType({
  name: "faqItem",
  title: "Pregunta frecuente",
  type: "object",
  fields: [
    defineField({
      name: "q",
      title: "Pregunta",
      type: "localeString",
      description: 'Ejemplo: "How long does a garage epoxy floor take to install?" / "¿Cuánto tarda la instalación…?"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "a",
      title: "Respuesta",
      type: "localeText",
      description: "Responde de forma directa en la primera frase (ayuda a Google y a los asistentes de IA).",
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "q.en", subtitle: "q.es" } },
});

/**
 * Texto enriquecido (editor WYSIWYG de Sanity): títulos, negrita, cursiva, listas y enlaces.
 * Se usa en las políticas para que se editen como en un procesador de textos.
 */
export const richText = defineType({
  name: "richText",
  title: "Texto con formato",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Párrafo", value: "normal" },
        { title: "Título de sección", value: "h2" },
        { title: "Subtítulo", value: "h3" },
      ],
      lists: [
        { title: "Viñetas", value: "bullet" },
        { title: "Numerada", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Negrita", value: "strong" },
          { title: "Cursiva", value: "em" },
          { title: "Subrayado", value: "underline" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Enlace",
            fields: [
              defineField({
                name: "href",
                title: "Dirección",
                type: "url",
                description: 'Ejemplos: "https://adssettings.google.com", "mailto:{email}", "tel:+14252007230".',
                validation: (r) => r.required().uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
              }),
              defineField({ name: "blank", title: "Abrir en una pestaña nueva", type: "boolean", initialValue: false }),
            ],
          },
        ],
      },
    },
  ],
});

export const localeRichText = defineType({
  name: "localeRichText",
  title: "Texto con formato (EN / ES)",
  type: "object",
  fields: [
    defineField({ name: "en", title: "English", type: "richText", validation: (r) => r.required() }),
    defineField({ name: "es", title: "Español", type: "richText" }),
  ],
});
