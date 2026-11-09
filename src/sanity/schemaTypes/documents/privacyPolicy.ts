import { defineField, defineType } from "sanity";

/**
 * POLÍTICA DE PRIVACIDAD (documento único). Requerida por Google Ads en páginas con formulario.
 * El contenido se edita con el editor visual (WYSIWYG): títulos, negritas, listas y enlaces.
 */
export const privacyPolicy = defineType({
  name: "privacyPolicy",
  title: "Política de privacidad",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "localeString",
      description: 'Ejemplo: "Privacy Policy" / "Política de privacidad".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Meta descripción (Google)",
      type: "localeText",
      description: 'Ejemplo: "How ECG Construction LLC collects, uses and protects the information you share…"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "updated",
      title: "Fecha de actualización",
      type: "localeString",
      description: 'Ejemplo: "Last updated: November 9, 2026" / "Última actualización: 9 de noviembre de 2026".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Contenido",
      type: "localeRichText",
      description:
        'Escribe la política como en un procesador de textos. Usa "Título de sección" para cada apartado y las viñetas para listas. Puedes usar {phone}, {email} y {license}.',
      validation: (r) => r.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Política de privacidad" }) },
});
