import { defineField, defineType } from "sanity";

/** RESEÑA de un cliente real (Google, Facebook, Yelp…). Se muestran en Inicio y Nosotros. */
export const review = defineType({
  name: "review",
  title: "Reseña",
  type: "document",
  fields: [
    defineField({
      name: "author",
      title: "Nombre del cliente",
      type: "string",
      description: 'Como aparece en la reseña. Ejemplo: "Maria G." o "John Smith".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "rating",
      title: "Estrellas (1 a 5)",
      type: "number",
      options: { list: [5, 4, 3, 2, 1], layout: "radio", direction: "horizontal" },
      initialValue: 5,
      validation: (r) => r.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "text",
      title: "Texto de la reseña",
      type: "localeText",
      description:
        "Copia el texto tal como lo escribió el cliente, en su idioma original. La traducción es opcional; si la dejas vacía se muestra el original.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "source",
      title: "Dónde la publicó",
      type: "string",
      options: { list: ["Google", "Facebook", "Yelp", "Nextdoor", "Angi", "Directa"], layout: "radio" },
      initialValue: "Google",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Fecha de la reseña",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
    }),
    defineField({
      name: "link",
      title: "Enlace a la reseña (opcional)",
      type: "url",
      description: "Si la reseña está publicada en Google u otro sitio, pega aquí su enlace.",
    }),
    defineField({
      name: "service",
      title: "Servicio (opcional)",
      type: "reference",
      to: [{ type: "service" }],
      description: "El trabajo que se hizo. Si se elige, la reseña también aparece en la página de ese servicio.",
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Las de número más bajo salen primero.",
      initialValue: 10,
    }),
  ],
  orderings: [{ title: "Orden", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "author", rating: "rating", source: "source", subtitle: "text.en" },
    prepare: ({ title, rating, source, subtitle }) => ({
      title: `${"★".repeat(rating ?? 0)} ${title}`,
      subtitle: `${source ?? ""} · ${subtitle ?? ""}`,
    }),
  },
});
