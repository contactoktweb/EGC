import { defineArrayMember, defineField, defineType } from "sanity";

/** POLÍTICA DE PRIVACIDAD (documento único). Requerida por Google Ads en páginas con formulario. */
export const privacyPolicy = defineType({
  name: "privacyPolicy",
  title: "Política de privacidad",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título", type: "localeString", description: 'Ejemplo: "Privacy Policy" / "Política de privacidad".', validation: (r) => r.required() }),
    defineField({ name: "description", title: "Meta descripción", type: "localeText", validation: (r) => r.required() }),
    defineField({
      name: "updated",
      title: "Fecha de actualización",
      type: "localeString",
      description: 'Ejemplo: "Last updated: November 9, 2026" / "Última actualización: 9 de noviembre de 2026".',
      validation: (r) => r.required(),
    }),
    defineField({ name: "intro", title: "Introducción", type: "localeText", validation: (r) => r.required() }),
    defineField({
      name: "sections",
      title: "Secciones",
      type: "array",
      description: "Puedes usar {phone}, {email} y {license} en los textos.",
      of: [
        defineArrayMember({
          type: "object",
          name: "privacySection",
          fields: [
            defineField({ name: "title", title: "Título de la sección", type: "localeString", validation: (r) => r.required() }),
            defineField({ name: "paragraphs", title: "Párrafos", type: "localeTextList" }),
            defineField({ name: "bullets", title: "Viñetas", type: "localeStringList" }),
          ],
          preview: { select: { title: "title.en", subtitle: "title.es" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Política de privacidad" }) },
});
