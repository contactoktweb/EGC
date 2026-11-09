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
