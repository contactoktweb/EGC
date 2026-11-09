import { defineField, defineType } from "sanity";

/** PREGUNTA FRECUENTE general (página de inicio, llms.txt y schema FAQPage). */
export const faq = defineType({
  name: "faq",
  title: "Pregunta frecuente",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Pregunta",
      type: "localeString",
      description: 'Ejemplo: "What are your business hours?" / "¿Cuál es su horario de atención?"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "answer",
      title: "Respuesta",
      type: "localeText",
      description: "Respuesta directa en la primera frase. Puedes usar {phone}, {email}, {license} y {years}.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Orden", type: "number", validation: (r) => r.required().integer() }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question.en", subtitle: "question.es" } },
});
